const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/database');

class MedicineStockHistory extends Model {}

MedicineStockHistory.init({
  historyid: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  medicineid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  recorddate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  stockin: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  stockout: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  remainingstock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdat: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP + interval '7 hours'"),
  },
}, {
  sequelize,
  tableName: 'medicine_stock_history',
  timestamps: false,
});

module.exports = MedicineStockHistory;