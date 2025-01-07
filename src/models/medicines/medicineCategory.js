const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/database');

class MedicineCategory extends Model {}

MedicineCategory.init({
  medicineid: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  },
  categoryid: {
    type: DataTypes.STRING(50),
    allowNull: false,
    primaryKey: true,
  },
}, {
  sequelize,
  tableName: 'medicinecategory',
  timestamps: false, // Trigger digunakan
});

module.exports = MedicineCategory;
