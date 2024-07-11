const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const Catalog = sequelize.define(
  'Catalog',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    shop_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    size: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    day_rent: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    day_maintenance: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    photo_url: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: 'catalogs',
  }
);

module.exports = Catalog;
