const { MedicineBatch } = require('../../models/medicines/associations');

exports.resetMedicineStock = async (req, res) => {
  const { medicineid } = req.params;

  try {
    // Cari data batch berdasarkan medicineid
    const batches = await MedicineBatch.findAll({ where: { medicineid } });

    if (batches.length === 0) {
      return res.status(404).json({ message: 'No batches found for the given medicine ID' });
    }

    // Meng-nolkan jumlah obat di semua batch yang terkait
    await MedicineBatch.update({ amount: 0 }, { where: { medicineid } });

    res.status(200).json({ message: 'All batch amounts reset successfully' });
  } catch (error) {
    console.error('Error resetting batch amounts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.resetBatchAmount = async (req, res) => {
  const { batchid, medicineid } = req.params;

  try {
    // Cari data batch berdasarkan batchid dan medicineid
    const batch = await MedicineBatch.findOne({ where: { batchid, medicineid } });

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found for the given medicine ID' });
    }

    // Meng-nolkan jumlah obat di batch
    batch.amount = 0;
    await batch.save();

    res.status(200).json({ message: 'Batch amount reset successfully' });
  } catch (error) {
    console.error('Error resetting batch amount:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};