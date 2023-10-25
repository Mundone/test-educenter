const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db').sequelize; // Adjust the path based on your file structure

const User = sequelize.define('User', {
  // Model attributes are defined here
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Add more attributes as needed
}, {
  // Other model options go here
});

// We recommend syncing the model with the database in a separate step or file
// (e.g., when you initialize your application or in a dedicated database setup script).

module.exports = User;
