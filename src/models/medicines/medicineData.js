const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/database');

class MedicineData extends Model {}

MedicineData.init(
  {
    medicineid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    medicinename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    description: {
      type: DataTypes.TEXT,
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedat: {
      type: DataTypes.DATE,
    },
    unit: {
      type: DataTypes.STRING(50),
    },
  },
  {
    sequelize,
    tableName: 'medicinedata',
    timestamps: false, // Karena trigger digunakan untuk mengatur waktu
  }
);

module.exports = MedicineData;
