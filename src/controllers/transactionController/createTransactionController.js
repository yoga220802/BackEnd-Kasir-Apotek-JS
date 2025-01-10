const {
    TransactionInfo,
    TransactionDetail,
    MedicineBatch,
    MedicineData,
} = require("../../models/transactions/associations");
const { v4: uuidv4 } = require("uuid");
const { Op, fn, col, literal } = require("sequelize");
const sequelize = require("../../config/database");

exports.createTransaction = async (req, res) => {
    const { medicines, payment, buyername, amount_given } = req.body;
    const { userid } = req.user;

    console.log("Incoming Request Body:", req.body);

    if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
        return res
            .status(400)
            .json({ message: "Medicines are required and should be an array" });
    }

    if (!payment || !["cash", "qris"].includes(payment)) {
        return res.status(400).json({ message: "Invalid payment method" });
    }

    if (!amount_given) {
        return res.status(400).json({ message: "Amount given is required" });
    }

    const currentDate = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const transactionCount = await TransactionInfo.count({
        where: literal(`to_char("trdate", 'YYYYMMDD') LIKE '${currentDate}%'`),
    });
    const transactionId = `TR-${currentDate}-${transactionCount + 1}`;
    const transactionDate = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    console.log("Generated Transaction ID:", transactionId);

    let total = 0;
    const transactionDetails = [];
    const medicineWarnings = [];

    const transaction = await sequelize.transaction();

    try {
        for (const medicine of medicines) {
            const { medicineid, amount } = medicine;

            if (!medicineid || !amount || amount <= 0) {
                throw new Error("Invalid medicine ID or amount");
            }

            console.log(`Processing medicine ID: ${medicineid}, Amount: ${amount}`);

            let remainingAmount = amount;
            const batches = await MedicineBatch.findAll({
                where: { medicineid },
                order: [["expirationdate", "ASC"]],
            });

            console.log(`Found Batches for ${medicineid}:`, batches);

            const filteredBatches = batches.filter(batch => {
                const isValidExpirationDate = new Date(batch.expirationdate) > new Date();
                const isValidAmount = batch.amount > 0;
                return isValidExpirationDate && isValidAmount;
            });

            console.log(`Valid Batches for ${medicineid}:`, filteredBatches);

            if (!filteredBatches || filteredBatches.length === 0) {
                throw new Error(`No valid batches found for medicine ID ${medicineid}`);
            }

            for (const batch of filteredBatches) {
                if (remainingAmount <= 0) break;

                const batchAmount = Math.min(batch.amount, remainingAmount);
                remainingAmount -= batchAmount;

                const medicineData = await MedicineData.findOne({ where: { medicineid } });

                if (!medicineData) {
                    throw new Error(`Medicine data not found for ID ${medicineid}`);
                }

                transactionDetails.push({
                    trid: transactionId,
                    medicineid,
                    batchid: batch.batchid,
                    amount: batchAmount,
                });

                total += batchAmount * medicineData.price;

                const daysToExpire = Math.ceil(
                    (new Date(batch.expirationdate) - new Date()) / (1000 * 60 * 60 * 24)
                );
                if (daysToExpire <= 30) {
                    medicineWarnings.push({
                        medicineid,
                        batchid: batch.batchid,
                        expirationdate: batch.expirationdate,
                        message: `Medicine will expire in ${daysToExpire} days`,
                    });
                }
            }

            if (remainingAmount > 0) {
                throw new Error(`Not enough stock for medicine ID ${medicineid}`);
            }
        }

        console.log("Total Transaction Amount:", total);

        const change = amount_given - total;
        if (change < 0) {
            throw new Error("Insufficient amount given");
        }

        console.log("Calculated Change:", change);

        // Insert into TransactionInfo
        const transactionInfo = await TransactionInfo.create(
            {
                trid: transactionId,
                trdate: transactionDate,
                total,
                payment,
                change,
                buyername,
                amount_given,
                userid,
            },
            { transaction }
        );

        console.log("Transaction Info Saved:", transactionInfo);

        // Insert into TransactionDetail
        await TransactionDetail.bulkCreate(transactionDetails, { transaction });

        console.log("Transaction Details Saved:", transactionDetails);

        await transaction.commit();

        res.status(201).json({
            message: "Transaction created successfully",
            change,
            total,
            medicines: transactionDetails.map((detail) => ({
                medicineid: detail.medicineid,
                batchid: detail.batchid,
                message:
                    medicineWarnings.find(
                        (warning) =>
                            warning.medicineid === detail.medicineid &&
                            warning.batchid === detail.batchid
                    )?.message || "Medicine is safe to consume",
            })),
        });
    } catch (error) {
        await transaction.rollback();
        console.error("Error creating transaction:", error.message || error);
        if (error.name === "SequelizeValidationError") {
            console.error(
                "Validation Errors:",
                error.errors.map((e) => e.message)
            );
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors.map((e) => e.message),
            });
        }
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};
