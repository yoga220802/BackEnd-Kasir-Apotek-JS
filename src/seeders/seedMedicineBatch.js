const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { v4: uuidv4 } = require('uuid');

const csvFilePath = path.join(__dirname, '../datasets/medicineData.csv');

const medicineBatches = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    medicineBatches.push({
      medicineName: row.medicineName,
      amount: parseInt(row.stock),
      expirationDate: row.expirationDate,
    });
  })
  .on('end', async () => {
    console.log('CSV file successfully processed');
    // console.log('Medicine Batches:', medicineBatches); // Debugging line to log CSV data
    await seedMedicineBatches();
  });

const seedMedicineBatches = async () => {
  const batchId = uuidv4();
  try {
    for (const batch of medicineBatches) {
      const [medicine] = await sequelize.query(
        `SELECT medicineid FROM public.medicinedata WHERE medicinename = :medicineName`,
        {
          replacements: { medicineName: batch.medicineName },
          type: QueryTypes.SELECT,
        }
      );

      if (medicine) {
        await sequelize.query(
          `
          INSERT INTO public.medicinebatch (batchid, medicineid, amount, expirationdate)
          VALUES (:batchId, :medicineId, :amount, :expirationDate)
          `,
          {
            replacements: {
              batchId: batchId,
              medicineId: medicine.medicineid,
              amount: batch.amount,
              expirationDate: batch.expirationDate,
            },
            type: QueryTypes.INSERT,
          }
        );
      }
    }
    console.log('Medicine batches seeder executed successfully.');
  } catch (err) {
    console.error('Error while seeding medicine batches:', err);
  } finally {
    await sequelize.close();
  }
};
