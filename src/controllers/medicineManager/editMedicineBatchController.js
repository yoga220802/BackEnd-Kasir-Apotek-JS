const { MedicineBatch } = require('../../models/medicines/associations');

exports.updateMedicineBatch = async (req, res) => {
  const { batchid } = req.params;
  const { medicines } = req.body;

  if (!batchid || !medicines || !Array.isArray(medicines)) {
    return res.status(400).json({ message: 'Invalid request body' });
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
      const existingBatch = await MedicineBatch.findOne({ where: { batchid, medicineid } });

      if (!existingBatch) {
        errors.push(`Medicine with ID "${medicineid}" not found in batch "${batchid}"`);
        continue;
      }

      const updateData = {};
      if (amount !== undefined) updateData.amount = amount;
      if (expirationdate !== undefined) updateData.expirationdate = expirationdate;

      await existingBatch.update(updateData);
      successes.push(`Medicine with ID "${medicineid}" updated successfully`);
    } catch (error) {
      errors.push(`Failed to update medicine with ID "${medicineid}". Error: ${error.message}`);
    }
  }

  return res.status(200).json({ successes, errors });
};