const {
	MedicineData,
	MedicineBatch,
	Categories,
	MedicineCategory,
} = require("../../models/associations");
const { formatMedicine } = require("../../helpers/medicineHelper");

exports.getMedicines = async (req, res) => {
	try {
		const medicines = await MedicineData.findAll({
			where: { is_deleted: false },
			attributes: [
				"medicineid",
				"medicinename",
				"brand",
				"price",
				"stock",
				"unit",
				"createdat",
				"updatedat",
			],
			include: [
				{
					model: MedicineBatch,
					as: "Batches",
					attributes: ["batchid", "expirationdate"],
				},
				{
					model: Categories,
					through: { model: MedicineCategory, attributes: [] },
					as: "Categories",
					attributes: ["categoryid", "categoryname"],
				},
			],
		});

		if (!medicines.length) {
			return res.status(404).json({ message: "No medicines found" });
		}

		const formattedMedicines = medicines.map((medicine) =>
			formatMedicine(medicine)
		);

		res.status(200).json({
			message: "Medicines retrieved successfully",
			data: formattedMedicines,
		});
	} catch (error) {
		console.error("Error fetching medicines:", error);
		if (error.name === "SequelizeConnectionError") {
			return res.status(503).json({ message: "Service unavailable" });
		}
		if (error.name === "SequelizeValidationError") {
			return res.status(400).json({ message: "Validation error" });
		}
		if (error.name === "SequelizeDatabaseError") {
			return res.status(500).json({ message: "Database error" });
		}
		res.status(500).json({ message: "Internal server error" });
	}
};

exports.getMedicineById = async (req, res) => {
	const { medicineid } = req.params;

	try {
		const medicine = await MedicineData.findOne({
			where: { medicineid, is_deleted: false },
			attributes: [
				"medicineid",
				"medicinename",
				"brand",
				"price",
				"stock",
				"unit",
				"createdat",
				"updatedat",
			],
			include: [
				{
					model: MedicineBatch,
					as: "Batches",
					attributes: ["batchid", "expirationdate"],
				},
				{
					model: Categories,
					through: { model: MedicineCategory, attributes: [] },
					as: "Categories",
					attributes: ["categoryid", "categoryname"],
				},
			],
		});

		if (!medicine) {
			return res.status(404).json({ message: "Medicine not found" });
		}

		const formattedMedicine = formatMedicine(medicine);

		res.status(200).json({
			message: "Medicine retrieved successfully",
			data: formattedMedicine,
		});
	} catch (error) {
		console.error("Error fetching medicine by ID:", error);
		if (error.name === "SequelizeConnectionError") {
			return res.status(503).json({ message: "Service unavailable" });
		}
		if (error.name === "SequelizeValidationError") {
			return res.status(400).json({ message: "Validation error" });
		}
		if (error.name === "SequelizeDatabaseError") {
			return res.status(500).json({ message: "Database error" });
		}
		res.status(500).json({ message: "Internal server error" });
	}
};
