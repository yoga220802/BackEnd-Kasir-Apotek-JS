const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/database");

class TransactionInfo extends Model {}

TransactionInfo.init(
  {
    trid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    trdate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP + interval '7 hours'"),
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    payment: {
      type: DataTypes.ENUM("cash", "qris"),
      allowNull: false,
    },
    change: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
      },
    },
    buyername: {
      type: DataTypes.STRING,
    },
    userid: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "transactioninfo",
    timestamps: false, // Menggunakan trigger
  }
);

module.exports = TransactionInfo;
