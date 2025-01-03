const { MedicineData, MedicineCategory, Categories } = require('../../models/medicines/associations');
const sequelize = require('sequelize');

exports.updateMedicine = async (req, res) => {
  try {
    const { medicineid } = req.params;
    const { medicinename, brand, price, unit, categories } = req.body;

    // Find the medicine by ID
    const medicine = await MedicineData.findOne({ where: { medicineid } });

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // Update fields if provided in the request body
    const updatedFields = {};
    if (medicinename) updatedFields.medicinename = medicinename;
    if (brand) updatedFields.brand = brand;
    if (price) updatedFields.price = price;
    if (unit) updatedFields.unit = unit;

    // Update medicine data
    await medicine.update(updatedFields);

    // Update categories if provided
    if (categories && Array.isArray(categories)) {
      // Remove existing categories
      await MedicineCategory.destroy({ where: { medicineid: medicine.medicineid } });

      // Add new categories
      for (const categoryid of categories) {
        const categoryExists = await Categories.findByPk(categoryid);
        if (!categoryExists) {
          return res.status(400).json({ message: `Category with ID "${categoryid}" not found` });
        }

        await MedicineCategory.create({
          medicineid: medicine.medicineid,
          categoryid: categoryid,
        });
      }
    }

    // Response after update
    res.status(200).json({
      message: 'Medicine updated successfully',
      medicine: {
        medicineid: medicine.medicineid,
        medicinename: medicine.medicinename,
        brand: medicine.brand,
        price: medicine.price,
        unit: medicine.unit,
        categories: categories || [],
      },
    });
  } catch (error) {
    console.error('Error updating medicine:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};