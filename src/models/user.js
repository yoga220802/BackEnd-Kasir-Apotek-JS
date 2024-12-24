const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const Role = require('./role');

class User extends Model {}

User.init(
  {
    userid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    pass: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userphone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roleid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: false, // Karena trigger digunakan untuk mengatur waktu
  }
);

// Relasi dengan Role
User.belongsTo(Role, { foreignKey: 'roleid', as: 'role' });
Role.hasMany(User, { foreignKey: 'roleid' });

module.exports = User;
