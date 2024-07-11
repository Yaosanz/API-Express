require('dotenv').config();

const { Sequelize } = require('sequelize');

const dbConfig = {
  dialect: 'postgres',
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  define: {
    timestamps: false,
  },
};

const sequelize = new Sequelize(dbConfig);

module.exports = { sequelize };
