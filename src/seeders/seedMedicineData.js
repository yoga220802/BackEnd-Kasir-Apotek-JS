const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const csvFilePath = path.join(__dirname, '../datasets/medicineData.csv');

const medicines = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    medicines.push({
      medicineName: row.medicineName,
      brand: row.brand,
      price: parseInt(row.medicinePrice),
      description: row.description,
      unit: row.unit,
    });
  })
  .on('end', async () => {
    console.log('CSV file successfully processed');
    console.log('Medicines:', medicines); // Debugging line to log CSV data
    await seedMedicines();
  });

const seedMedicines = async () => {
  try {
    for (const medicine of medicines) {
      await sequelize.query(
        `
        INSERT INTO public.medicinedata (medicinename, brand, price, description, unit)
        VALUES (:medicineName, :brand, :price, :description, :unit)
        `,
        {
          replacements: {
            medicineName: medicine.medicineName,
            brand: medicine.brand,
            price: medicine.price,
            description: medicine.description,
            unit: medicine.unit,
          },
          type: QueryTypes.INSERT,
        }
      );
    }
    console.log('Medicines seeder executed successfully.');
  } catch (err) {
    console.error('Error while seeding medicines:', err);
  } finally {
    await sequelize.close();
  }
};
