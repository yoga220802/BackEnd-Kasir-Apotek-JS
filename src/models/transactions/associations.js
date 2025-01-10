const TransactionInfo = require("./transactionInfo");
const TransactionDetail = require("./transactionDetail");
const MedicineBatch = require("../medicines/medicineBatch");
const MedicineData = require("../medicines/medicineData");
const User = require("../users/user");

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
  foreignKey: "batchid",
  targetKey: "batchid",
  as: "Batch",
});

// Relasi antara TransactionInfo dan User
TransactionInfo.belongsTo(User, {
  foreignKey: "userid",
  as: "User",
});

module.exports = {
  TransactionInfo,
  TransactionDetail,
  MedicineBatch,
  MedicineData,
  User,
};