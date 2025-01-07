const {
	MedicineBatch,
	MedicineData,
	Categories,
	MedicineCategory,
} = require("../../models/medicines/associations");
const Sequelize = require("sequelize");

exports.getMedicineBatches = async (req, res) => {
	try {
		const batches = await MedicineBatch.findAll({
			attributes: [
				"batchid",
				[
					Sequelize.fn("TO_CHAR", Sequelize.col("entryat"), "YYYY-MM-DD"),
					"entryat",
				],
			],
			group: ["batchid", "entryat"],
		});

		const uniqueBatchesMap = new Map();
		batches.forEach((batch) => {
			if (!uniqueBatchesMap.has(batch.batchid)) {
				uniqueBatchesMap.set(batch.batchid, batch);
			}
		});

		const formattedBatches = Array.from(uniqueBatchesMap.values()).map(
			(batch) => ({
				batchid: batch.batchid,
				entryat: batch.entryat,
			})
		);

		res.status(200).json(formattedBatches);
	} catch (error) {
		console.error("Error fetching medicine batches:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

exports.getMedicineBatchById = async (req, res) => {
	const { batchid } = req.params;

	try {
		const batchData = await MedicineBatch.findAll({
			where: { batchid },
			attributes: ["batchid", "entryat", "expirationdate", "medicineid", "amount"],
			include: [
				{
					model: MedicineData,
					as: "Medicine",
					attributes: [
						"medicineid",
						"medicinename",
						"brand",
						"price",
						"stock",
						"unit",
						"is_deleted",
					],
					include: [
						{
							model: Categories,
							through: { model: MedicineCategory, attributes: [] },
							as: "Categories",
							attributes: ["categoryid", "categoryname"],
						},
					],
				},
			],
		});

		if (!batchData || batchData.length === 0) {
			return res.status(404).json({ message: "Batch not found" });
		}

		const formattedBatch = {
			batchid: batchid,
			entryat: batchData[0].entryat,
			medicines: batchData.map((batch) => ({
				medicineid: batch.Medicine.medicineid,
				expirationdate: batch.expirationdate,
				medicinename: batch.Medicine.medicinename,
				brand: batch.Medicine.brand,
				price: batch.Medicine.price,
				totalStock: batch.Medicine.stock,
				unit: batch.Medicine.unit,
				amount: batch.amount,
				isDeleted: batch.Medicine.is_deleted,
				categories: batch.Medicine.Categories.map((category) => ({
					categoryID: category.categoryid,
					categoryName: category.categoryname,
				})),
			})),
		};

		res.status(200).json({
			message: "Medicine batch retrieved successfully",
			data: formattedBatch,
		});
	} catch (error) {
		console.error("Error fetching medicine batch by ID:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};
