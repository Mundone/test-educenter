const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { sequelize, DataTypes } = require("../db");
// Import other strategies as you need them

// Import your user model
const User = require('../models/models')(sequelize, DataTypes).User; // Adjust the path based on your file structure

// Passport session setup.
passport.serializeUser(function(user, done) {
  done(null, user.id); // or whatever you use as a unique identifier for users
});

passport.deserializeUser(function(id, done) {
  User.findByPk(id).then(function(user) {
    done(null, user);
  }).catch(done);
});

// Use the LocalStrategy within Passport.
passport.use(new LocalStrategy(
  { usernameField: 'email' }, // Adjust as necessary, 'email' is common
  function(email, password, done) {
    // Adjust the following code based on how your user's data is stored:
    User.findOne({ where: { email: email } }).then(function(user) {
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.log(err);
          throw err;
        }
        if (isMatch) {
          console.log("ismatch");
          return done(null, user);
        } else {
          console.log(user.password);
          console.log(password);
          console.log(user.password+password+user.password);

          return done(null, false, { message: 'Password incorrect' });
        }
      });
    }).catch(done);
  }
));

// TODO: Set up other strategies (Facebook, Google, etc.)
