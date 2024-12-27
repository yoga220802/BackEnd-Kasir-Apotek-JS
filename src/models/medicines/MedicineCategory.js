const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/database');
const MedicineData = require('./medicineData');
const Categories = require('./Categories');

class MedicineCategory extends Model {}

MedicineCategory.init(
  {
    medicineid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    categoryid: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'medicinecategory',
    timestamps: false,
  }
);

// Foreign key relationships
MedicineCategory.belongsTo(MedicineData, { foreignKey: 'medicineid' });
MedicineCategory.belongsTo(Categories, { foreignKey: 'categoryid' });

module.exports = MedicineCategory;
