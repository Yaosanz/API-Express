const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const Shipment = sequelize.define(
  'Shipment',
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
    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    last_status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    waybill_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'shipment',
  }
);

module.exports = Shipment;
