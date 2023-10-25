// controllers/userController.js

const { User } = require('../models'); // Adjust the path if your file structure is different

exports.createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Add other CRUD operations as needed
