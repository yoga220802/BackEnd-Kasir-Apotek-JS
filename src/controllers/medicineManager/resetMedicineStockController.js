const { MedicineBatch } = require("../../models/associations");

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
		if (error.name === 'SequelizeConnectionError') {
			return res.status(503).json({ message: "Service unavailable" });
		}
		res.status(500).json({ message: "Internal server error" });
	}
};

exports.resetBatchAmount = async (req, res) => {
	const { batchid, medicineid } = req.params;

	try {
		const batch = await MedicineBatch.findOne({ where: { batchid, medicineid } });

		if (!batch) {
			return res
				.status(404)
				.json({ message: "Batch not found for the given medicine ID" });
		}

		batch.amount = 0;
		await batch.save();

		res.status(200).json({ message: "Batch amount reset successfully" });
	} catch (error) {
		console.error("Error resetting batch amount:", error);
		if (error.name === 'SequelizeConnectionError') {
			return res.status(503).json({ message: "Service unavailable" });
		}
		res.status(500).json({ message: "Internal server error" });
	}
};
