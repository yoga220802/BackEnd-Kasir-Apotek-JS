const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/database');

class DailySalesSummary extends Model {}

DailySalesSummary.init({
  summaryid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  summarydate: {
    type: DataTypes.DATE,
    allowNull: false,
    unique: true,
  },
  totalincome: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  totalmedicinessold: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  totaltransactions: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  topmedicine: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: [],
  },
  totalcashpayments: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  totalqrispayments: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  cashpaymentcount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  qristransactioncount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  createdat: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP + interval '7 hours'"),
  },
  updatedat: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP + interval '7 hours'"),
  },
}, {
  sequelize,
  tableName: 'daily_sales_summary',
  timestamps: false,
});

module.exports = DailySalesSummary;