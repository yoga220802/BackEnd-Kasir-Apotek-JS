const {
	MedicineData,
	MedicineBatch,
} = require("../../models/associations");
const { v4: uuidv4 } = require("uuid");

exports.restockMedicine = async (req, res = null) => {
	try {
		let medicines = req.body || req;

		if (!Array.isArray(medicines)) {
			medicines = [medicines];
		}

		const batchid = uuidv4();
		const successfulRestocks = [];
		const failedRestocks = [];

		for (const medicine of medicines) {
			const { medicineid, amount, expirationdate } = medicine;

			const existingMedicine = await MedicineData.findOne({
				where: { medicineid },
			});

			if (!existingMedicine) {
				failedRestocks.push({
					medicineid,
					reason: "Medicine ID not found in the database.",
				});
				continue;
			}

			await MedicineBatch.create({
				batchid,
				medicineid,
				amount,
				expirationdate,
			});

			successfulRestocks.push({
				medicineid,
				medicinename: existingMedicine.medicinename,
				amount,
				expirationdate,
			});
		}

		const result = {
			batchid,
			successfulRestocks,
			failedRestocks,
		};

		if (res) {
			return res.status(200).json({
				message: "Restock process completed.",
				...result,
			});
		} else {
			return result;
		}
	} catch (error) {
		console.error(error);

		if (res) {
			if (error.name === 'SequelizeValidationError') {
				return res.status(400).json({ message: "Validation error.", error: error.message });
			}
			if (error.name === 'SequelizeDatabaseError') {
				return res.status(500).json({ message: "Database error.", error: error.message });
			}
			return res
				.status(500)
				.json({ message: "Internal server error.", error: error.message });
		}
		throw error;
	}
};
