const express = require('express');
const swaggerUi = require('swagger-ui-express');
const logger = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes/index.routes');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

require('./config/passport-setup'); // Adjust the path to your Passport configuration file

const app = express();
const port = 3000;

// Import the Swagger documentation
const swaggerDocument = require('./swagger.js');

// Database setup
const sequelize = require("./db").sequelize;

const authRoutes = require('./routes/auth.routes');

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Swagger UI setup
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(session({
    secret: 'secret', // Change this to a long, random string in production
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true } // Uncomment if you have HTTPS working
  }));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/auth', authRoutes);  // Using the '/auth' base path as an example

// Routers setup
app.use('/', indexRouter);
// app.use('/educationCenter', educationCenterRouter); // Uncomment this line when you have the educationCenterRouter ready

// Test and log database connection
sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.error('Error: ', err));

// Start the server
app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app; // Exporting for testing or if you are running your server from another file.
