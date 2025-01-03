const { Categories, MedicineCategory } = require('../../models/medicines/associations');

exports.deleteCategory = async (req, res) => {
  const { categoryid } = req.params;

  try {
    // Cari kategori berdasarkan ID
    const category = await Categories.findOne({ where: { categoryid } });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Hapus data kategori terkait di tabel junction
    await MedicineCategory.destroy({ where: { categoryid } });

    // Hapus kategori
    await category.destroy();

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};