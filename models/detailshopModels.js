const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const DetailShop = sequelize.define(
  'DetailShop',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
  },
  {
    tableName: 'detail_shops',
  }
);

module.exports = DetailShop;
