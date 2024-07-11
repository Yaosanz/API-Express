const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const Transaction = sequelize.define(
  'Transaction',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    payment_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    transaction_item: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    shop_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    shipment_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    start_rent_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    end_rent_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'transactions',
  }
);

module.exports = Transaction;
