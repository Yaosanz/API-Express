const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const ShipmentStatus = sequelize.define(
  'ShipmentStatus',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    shipment_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: 'shipment_status',
  }
);

module.exports = ShipmentStatus;
