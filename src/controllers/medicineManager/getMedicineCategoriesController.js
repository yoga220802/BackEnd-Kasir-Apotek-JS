const {
	Categories,
	MedicineData,
	MedicineCategory,
} = require("../../models/medicines/associations");

exports.getMedicineCategories = async (req, res) => {
	try {
		const categories = await Categories.findAll({
			attributes: ["categoryid", "categoryname", "categorydescription"],
		});

		if (!categories || categories.length === 0) {
			return res.status(404).json({ message: "No categories found" });
		}
		res.status(200).json({
			message: "Categories retrieved successfully",
			data: categories,
		});
	} catch (error) {
		console.error("Error fetching categories:", error);
		if (error.name === "SequelizeConnectionError") {
			return res.status(503).json({ message: "Service unavailable" });
		}
		res.status(500).json({ message: "Internal server error" });
	}
};

exports.getMedicinesByCategoryId = async (req, res) => {
	const { categoryid } = req.params;

	try {
		const category = await Categories.findOne({
			where: { categoryid },
			attributes: ["categoryid", "categoryname", "categorydescription"],
			include: [
				{
					model: MedicineData,
					through: { attributes: [] },
					attributes: ["medicineid", "medicinename", "is_deleted"],
					as: "Medicines",
				},
			],
		});

		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}

		const formattedResponse = {
			categoryid: category.categoryid,
			categoryname: category.categoryname,
			categorydescription: category.categorydescription,
			medicines: category.Medicines.map((medicine) => ({
				medicineid: medicine.medicineid,
				medicineName: medicine.medicinename,
				isDeleted: medicine.is_deleted,
			})),
		};
		res.status(200).json({
			message: "Medicines retrieved successfully",
			data: formattedResponse,
		});
	} catch (error) {
		console.error("Error fetching medicines by category ID:", error);
		if (error.name === "SequelizeConnectionError") {
			return res.status(503).json({ message: "Service unavailable" });
		}
		res.status(500).json({ message: "Internal server error" });
	}
};
