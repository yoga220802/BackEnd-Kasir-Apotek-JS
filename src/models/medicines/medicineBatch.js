const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/database');

class MedicineBatch extends Model {}

MedicineBatch.init({
  batchid: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  medicineid: {
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
  entryat: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  expirationdate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'medicinebatch',
  timestamps: false, // Trigger digunakan
});

module.exports = MedicineBatch;
