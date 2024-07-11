const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const TransactionItems = sequelize.define(
  'TransactionItems',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    transaction_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    costume_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: 'transaction_items',
  }
);

module.exports = TransactionItems;
