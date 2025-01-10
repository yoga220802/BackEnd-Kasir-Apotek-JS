const { MedicineBatch } = require("../../models/associations");

exports.updateMedicineBatch = async (req, res) => {
	const { batchid } = req.params;
	const { medicines } = req.body;

	if (!batchid || !medicines || !Array.isArray(medicines)) {
		return res.status(400).json({ message: "Invalid request body" });
	}

	const errors = [];
	const successes = [];

	for (const medicine of medicines) {
		const { medicineid, amount, expirationdate } = medicine;

		if (!medicineid) {
			errors.push(`Medicine ID is required`);
			continue;
		}

		try {
			const existingBatch = await MedicineBatch.findOne({
				where: { batchid, medicineid },
			});

			if (!existingBatch) {
				errors.push(
					`Medicine with ID "${medicineid}" not found in batch "${batchid}"`
				);
				continue;
			}

			const updateData = {};
			if (amount !== undefined) updateData.amount = amount;
			if (expirationdate !== undefined) updateData.expirationdate = expirationdate;

			await existingBatch.update(updateData);
			successes.push(`Medicine with ID "${medicineid}" updated successfully`);
		} catch (error) {
			if (error.name === 'SequelizeValidationError') {
				errors.push(
					`Validation error for medicine with ID "${medicineid}". Error: ${error.message}`
				);
			} else if (error.name === 'SequelizeDatabaseError') {
				errors.push(
					`Database error for medicine with ID "${medicineid}". Error: ${error.message}`
				);
			} else {
				errors.push(
					`Failed to update medicine with ID "${medicineid}". Error: ${error.message}`
				);
			}
		}
	}

	if (errors.length > 0) {
		return res.status(400).json({ successes, errors });
	}

	return res.status(200).json({ successes, errors });
};
