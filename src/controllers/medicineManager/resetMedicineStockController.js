const { MedicineBatch, MedicineData } = require("../../models/associations");
const { Op } = require("sequelize");

exports.resetMedicineStock = async (req, res) => {
	const { medicineid } = req.params;

	try {
		const batches = await MedicineBatch.findAll({ where: { medicineid } });

		if (batches.length === 0) {
			return res
				.status(404)
				.json({ message: "No batches found for the given medicine ID" });
		}

		await MedicineBatch.update({ amount: 0 }, { where: { medicineid } });

		res.status(200).json({ message: "All batch amounts reset successfully" });
	} catch (error) {
		console.error("Error resetting batch amounts:", error);
		if (error.name === "SequelizeConnectionError") {
			return res.status(503).json({ message: "Service unavailable" });
		}
		res.status(500).json({ message: "Internal server error" });
	}
};

exports.deleteExpiredMedicines = async (req, res) => {
	try {
		const now = new Date();
		const tomorrow = new Date(now);
		tomorrow.setDate(tomorrow.getDate() + 1);
		const expiredBatches = await MedicineBatch.findAll({
			where: {
				expirationdate: {
					[Op.lte]: tomorrow,
				},
			},
			include: [
				{
					model: MedicineData,
					as: "Medicine",
					attributes: ["medicinename"],
				},
			],
		});

		if (expiredBatches.length === 0) {
			return res.status(404).json({ message: "No expired medicines found" });
		}

		const deletedMedicines = expiredBatches.map(
			(batch) => batch.Medicine.medicinename
		);
		const deletedCount = expiredBatches.length;

		await MedicineBatch.update(
			{ amount: 0 },
			{
				where: {
					expirationdate: {
						[Op.lt]: tomorrow,
					},
				},
			}
		);

		res.status(200).json({
			message: "Expired medicines deleted successfully",
			deletedCount,
			deletedMedicines,
		});
	} catch (error) {
		console.error("Error deleting expired medicines:", error);
		if (error.name === "SequelizeConnectionError") {
			return res.status(503).json({ message: "Service unavailable" });
		}
		res.status(500).json({ message: "Internal server error" });
	}
};
