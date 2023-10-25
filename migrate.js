const { Sequelize, DataTypes } = require('sequelize');

// Set up connection with the database
const sequelize = new Sequelize('educenter', 'root', '1113', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // Disable logging; set to console.log to see the raw SQL queries
});

// Test the database connection
async function authenticateDB() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
}

// Call the authenticate function
authenticateDB();

// Import models (Example with a 'Test' model)
const TestModel = require('./models/models')(sequelize, DataTypes); // Adjust path if needed

// Sync the models with the database and close the connection
sequelize.sync()
    .then(() => {
        console.log('Database sync complete.');
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
    })
    .finally(() => {
        // This will close the database connection effectively ending the script
        sequelize.close().then(() => console.log('Connection closed.'));
    });
