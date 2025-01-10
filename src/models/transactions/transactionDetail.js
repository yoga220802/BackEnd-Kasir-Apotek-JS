const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/database");

class TransactionDetail extends Model {}

TransactionDetail.init(
  {
    trid: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    medicineid: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    batchid: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
  },
  {
    sequelize,
    tableName: "transactiondetail",
    timestamps: false, // Menggunakan trigger
  }
);

module.exports = TransactionDetail;