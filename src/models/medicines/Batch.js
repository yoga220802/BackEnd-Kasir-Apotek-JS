const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/database');
const MedicineData = require('./medicineData');

class Batch extends Model {}

Batch.init(
  {
    batchid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    medicineid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
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
  },
  {
    sequelize,
    tableName: 'medicinebatch',
    timestamps: false,
  }
);

// Foreign key relationship with MedicineData
Batch.belongsTo(MedicineData, { foreignKey: 'medicineid', onDelete: 'CASCADE' });
MedicineData.hasMany(Batch, { foreignKey: 'medicineid' });

module.exports = Batch;
