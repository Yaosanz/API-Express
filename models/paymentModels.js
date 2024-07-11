const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const Payments = sequelize.define(
  'Payments',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    invoice_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'payments',
  }
);

module.exports = Payments;
