const {
	Categories,
	MedicineCategory,
} = require("../../models/medicines/associations");

exports.deleteCategory = async (req, res) => {
	const { categoryid } = req.params;

	try {
		const category = await Categories.findOne({ where: { categoryid } });

		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}

		await MedicineCategory.destroy({ where: { categoryid } });

		await category.destroy();

		res.status(200).json({ message: "Category deleted successfully" });
	} catch (error) {
		console.error("Error deleting category:", error);
		if (error.name === 'SequelizeForeignKeyConstraintError') {
			return res.status(409).json({ message: "Cannot delete category due to foreign key constraint" });
		}
		if (error.name === 'SequelizeDatabaseError') {
			return res.status(400).json({ message: "Database error occurred" });
		}
		res.status(500).json({ message: "Internal server error" });
	}
};
