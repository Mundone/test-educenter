const EducationCenter = require("../models/educationCenter.model.js");

// Create and Save a new EducationCenter
exports.create = (req, res) => {
    
};

// Retrieve all Tutorials from the database (with condition).
exports.findAll = (req, res) => {
    console.log('sadasdasdas');
    EducationCenter.findAll().then(res => {
        console.log(res)
    }).catch((error) => {
        console.error('Failed to retrieve data : ', error);
    });
};

// Find a single EducationCenter with a id
exports.findOne = (req, res) => {
  
};

// Update a EducationCenter identified by the id in the request
exports.update = (req, res) => {
  
};

// Delete a EducationCenter with the specified id in the request
exports.delete = (req, res) => {
  
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  
};