const { Categories } = require('../../models/medicines/associations');

exports.updateCategoryDescription = async (req, res) => {
  const { categoryid } = req.params;
  const { categorydescription } = req.body;

  if (!categorydescription) {
    return res.status(400).json({ message: 'Category description is required' });
  }

  try {
    const category = await Categories.findOne({ where: { categoryid } });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.update({ categorydescription });

    res.status(200).json({
      message: 'Category description updated successfully',
      category: {
        categoryid: category.categoryid,
        categoryname: category.categoryname,
        categorydescription: category.categorydescription,
      },
    });
  } catch (error) {
    console.error('Error updating category description:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};