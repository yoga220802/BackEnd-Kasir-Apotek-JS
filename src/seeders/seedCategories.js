const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const csvFilePath = path.join(__dirname, '../datasets/medicineCategories.csv');

const categories = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    categories.push({
      categoryID: row.categoryID,
      categoryName: row.categoryName,
      categoryDescription: row.categoryDescription,
    });
  })
  .on('end', async () => {
    console.log('CSV file successfully processed');
    console.log('Categories:', categories); // Debugging line to log CSV data
    await seedCategories();
  });

const seedCategories = async () => {
  try {
    for (const category of categories) {
      await sequelize.query(
        `
        INSERT INTO medicine_categories (categoryID, categoryName, categoryDescription)
        VALUES (:categoryID, :categoryName, :categoryDescription)
        ON CONFLICT (categoryID) DO NOTHING
        `,
        {
          replacements: {
            categoryID: category.categoryID,
            categoryName: category.categoryName,
            categoryDescription: category.categoryDescription,
          },
          type: QueryTypes.INSERT,
        }
      );
    }
    console.log('Categories seeder executed successfully.');
  } catch (err) {
    console.error('Error while seeding categories:', err);
  } finally {
    await sequelize.close();
  }
};
