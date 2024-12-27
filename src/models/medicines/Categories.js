const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/database');

class Categories extends Model {}

Categories.init({
  categoryid: {
    type: DataTypes.STRING(50),
    primaryKey: true,
  },
  categoryname: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  categorydescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'medicine_categories',
  timestamps: false,
});

module.exports = Categories;
