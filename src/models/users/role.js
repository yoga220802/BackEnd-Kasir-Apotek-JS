const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/database");

class Role extends Model {}


Role.init(
    {
      roleid: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      rolename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'roles',
      timestamps: false,
    }
  );
  
  module.exports = Role;