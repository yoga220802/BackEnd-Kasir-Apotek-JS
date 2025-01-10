const MedicineData = require("./medicines/medicineData");
const MedicineBatch = require("./medicines/medicineBatch");
const MedicineCategory = require("./medicines/medicineCategory");
const Categories = require("./medicines/categories");
const TransactionInfo = require("./transactions/transactionInfo");
const TransactionDetail = require("./transactions/transactionDetail");
const User = require("./users/user");

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
Categories.belongsToMany(MedicineData, {
  through: MedicineCategory,
  foreignKey: "categoryid",
  as: "Medicines",
});
MedicineData.belongsToMany(Categories, {
  through: MedicineCategory,
  foreignKey: "medicineid",
  as: "Categories",
});

// Hubungan tambahan untuk MedicineCategory
MedicineCategory.belongsTo(MedicineData, { foreignKey: "medicineid" });
MedicineCategory.belongsTo(Categories, { foreignKey: "categoryid" });

// Relasi antara TransactionInfo dan TransactionDetail
TransactionInfo.hasMany(TransactionDetail, {
  foreignKey: "trid",
  onDelete: "CASCADE",
  as: "Details",
});
TransactionDetail.belongsTo(TransactionInfo, {
  foreignKey: "trid",
  onDelete: "CASCADE",
  as: "Transaction",
});

// Relasi antara TransactionDetail dan MedicineBatch
TransactionDetail.belongsTo(MedicineBatch, {
  foreignKey: { name: "batchid", allowNull: false },
  targetKey: "batchid", // Reference to batchid in MedicineBatch
  // constraints: false, // Disable automatic FK constraints
});
TransactionDetail.belongsTo(MedicineBatch, {
  foreignKey: { name: "medicineid", allowNull: false },
  targetKey: "medicineid", // Reference to medicineid in MedicineBatch
  // constraints: false, // Disable automatic FK constraints
});

MedicineBatch.hasMany(TransactionDetail, {
  foreignKey: "batchid",
  sourceKey: "batchid",
  // constraints: false,
});
MedicineBatch.hasMany(TransactionDetail, {
  foreignKey: "medicineid",
  sourceKey: "medicineid",
  // constraints: false,
});


// Relasi antara TransactionInfo dan User
TransactionInfo.belongsTo(User, {
  foreignKey: "userid",
  as: "User",
});

module.exports = {
  MedicineData,
  MedicineBatch,
  MedicineCategory,
  Categories,
  TransactionInfo,
  TransactionDetail,
  User,
};