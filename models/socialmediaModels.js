const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const SocialMediaUsers = sequelize.define(
  'SocialMediaUsers',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    tiktok_username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    instagram_username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    facebook_username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'social_media_users',
  }
);

module.exports = SocialMediaUsers;
