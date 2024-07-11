const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const AddressUsers = sequelize.define(
  'AddressUsers',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    recipient_name: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    full_address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    number_phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    latitude: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: 'address_users',
  }
);

module.exports = AddressUsers;
