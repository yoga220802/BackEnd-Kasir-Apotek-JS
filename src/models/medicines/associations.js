const MedicineData = require("./medicineData");
const MedicineBatch = require("./medicineBatch");
const MedicineCategory = require("./medicineCategory");
const Categories = require("./categories");

// Hubungan antara MedicineData dan MedicineBatch
MedicineData.hasMany(MedicineBatch, {
 foreignKey: "medicineid",
 onDelete: "CASCADE",
 as: "Batches",
});
MedicineBatch.belongsTo(MedicineData, {
 foreignKey: "medicineid",
 onDelete: "CASCADE",
 as: "Medicine",
});

// Hubungan antara MedicineData dan Categories melalui MedicineCategory
MedicineData.belongsToMany(Categories, {
 through: MedicineCategory,
 foreignKey: "medicineid",
});
Categories.belongsToMany(MedicineData, {
 through: MedicineCategory,
 foreignKey: "categoryid",
});

// Hubungan tambahan untuk MedicineCategory
MedicineCategory.belongsTo(MedicineData, { foreignKey: "medicineid" });
MedicineCategory.belongsTo(Categories, { foreignKey: "categoryid" });

module.exports = {
 MedicineData,
 MedicineBatch,
 MedicineCategory,
 Categories,
};
