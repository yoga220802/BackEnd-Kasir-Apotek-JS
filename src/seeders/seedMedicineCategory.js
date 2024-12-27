const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const medicineDataPath = path.join(__dirname, '../datasets/medicineData.csv');
const medicineCategoriesPath = path.join(__dirname, '../datasets/medicineCategories.csv');

const medicineData = [];
const medicineCategories = [];

fs.createReadStream(medicineDataPath)
  .pipe(csv())
  .on('data', (row) => {
    medicineData.push(row);
  })
  .on('end', async () => {
    fs.createReadStream(medicineCategoriesPath)
      .pipe(csv())
      .on('data', (row) => {
        medicineCategories.push(row);
      })
      .on('end', async () => {
        await seedMedicineCategory();
      });
  });

const seedMedicineCategory = async () => {
  try {
    for (const medicine of medicineData) {
      const medicineName = medicine.medicineName;
      const categories = medicine.categories.split(',');

      const [medicineResult] = await sequelize.query(
        `SELECT medicineid FROM public.medicinedata WHERE medicinename = :medicineName`,
        {
          replacements: { medicineName },
          type: QueryTypes.SELECT,
        }
      );

      if (medicineResult) {
        const medicineID = medicineResult.medicineid;

        for (const category of categories) {
          const [categoryResult] = await sequelize.query(
            `SELECT categoryid FROM public.medicine_categories WHERE categoryname = :categoryName`,
            {
              replacements: { categoryName: category.trim() },
              type: QueryTypes.SELECT,
            }
          );

          if (categoryResult) {
            const categoryID = categoryResult.categoryid;

            await sequelize.query(
              `INSERT INTO public.medicinecategory (medicineid, categoryid) VALUES (:medicineID, :categoryID) ON CONFLICT DO NOTHING`,
              {
                replacements: {
                  medicineID,
                  categoryID,
                },
                type: QueryTypes.INSERT,
              }
            );
          }
        }
      }
    }
    console.log('Medicine categories seeder executed successfully.');
  } catch (err) {
    console.error('Error while seeding medicine categories:', err);
  } finally {
    await sequelize.close();
  }
};
