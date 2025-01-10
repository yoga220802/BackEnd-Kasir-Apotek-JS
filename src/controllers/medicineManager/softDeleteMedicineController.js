const { MedicineData } = require('../../models/associations');

exports.softDeleteMedicine = async (req, res) => {
  const { medicineid } = req.params;

  try {
    const medicine = await MedicineData.findOne({ where: { medicineid } });

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    await medicine.update({ is_deleted: true });

    res.status(200).json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    console.error('Error deleting medicine:', error);
    if (error.name === 'SequelizeConnectionError') {
      return res.status(503).json({ message: 'Service unavailable' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};