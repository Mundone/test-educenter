const dbConfig = require("./config/db.config.js");
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: 'mysql',
  logging: false, // Disable logging; set to console.log to see the raw SQL queries
});

module.exports = {
  sequelize,
  DataTypes
};