const { sequelize, DataTypes } = require("../db");
const City = require("../models/models")(sequelize, DataTypes).City;
const router = require("express").Router();

/**
 * @swagger
 * /cities:
 *   get:
 *     summary: Retrieve all cities
 *     tags: [City]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/City'
 *       500:
 *         description: Internal Server Error
 */
router.get("/", async (req, res) => {
  try {
    // Fetch all records from the 'Cities' table
    const cities = await City.findAll();
    
    res.send(cities);
  } catch (err) {
    // If an error occurs during the fetch operation, send a server error response
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving cities."
    });
  }
});

/**
 * @swagger
 * /cities/{id}:
 *   get:
 *     summary: Retrieve a single city by ID
 *     tags: [City]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the city
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/City'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", async (req, res) => {
  try {
    const city = await City.findByPk(req.params.id);

    if (city) {
      res.send(city);
    } else {
      res.status(404).send({
        message: `Not found City with id ${req.params.id}.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving the City."
    });
  }
});

/**
 * @swagger
 * /cities:
 *   post:
 *     summary: Create a new city
 *     tags: [City]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/City'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/City'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

router.post("/", async (req, res) => {
  // Extracting data from the request body
  const educationCenterData = req.body;

  try {
    // Directly using Sequelize's 'create' method. It returns a promise, 
    // which resolves with the created instance, hence we use 'await' here.
    const city = await City.create(educationCenterData);

    // If the city is successfully created, send back the new data.
    res.status(201).send(city);
  } catch (err) {
    // If there's an error, send back a 500 status and the error message.
    res.status(500).send({
      message: err.message || "Some error occurred while creating the City."
    });
  }
});

/**
 * @swagger
 * /cities/{id}:
 *   put:
 *     tags:
 *       - City
 *     summary: "Update an city by ID"
 *     description: "This endpoint updates an existing city's information."
 *     operationId: "updateEducationCenter"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the city to update"
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: "Education center data to update"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/City"
 *     responses:
 *       200:
 *         description: "Education center updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/City"
 *       400:
 *         description: "Invalid request"
 *       404:
 *         description: "Education center not found"
 *       500:
 *         description: "Error updating city"
 */
router.put("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to update the city
    const [updateResponse] = await City.update(req.body, {
      where: { id: id }
    });

    if (updateResponse == 0) { // Check if the response is '0' (meaning no rows were updated) - this is Sequelize specific
      res.status(404).send({
        message: `Not found City with id ${id}.`
      });
    } else {
      // If successful, retrieve the updated city
      const updatedEducationCenter = await City.findByPk(id);
      res.send(updatedEducationCenter);
    }
  } catch (err) {
    res.status(500).send({
      message: `Error updating City with id ${id}`
    });
  }
});

/**
 * @swagger
 * /cities/{id}:
 *   delete:
 *     summary: Delete an city by its ID
 *     tags: [City]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the city to delete
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       200:
 *         description: Education center deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the successful deletion
 *                   example: City was deleted successfully!
 *       404:
 *         description: Education center not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to delete the city
    const numberOfDeletedRows = await City.destroy({
      where: { id: id }
    });

    if (numberOfDeletedRows === 0) {
      res.status(404).send({
        message: `Not found City with id ${id}.`
      });
    } else {
      res.status(200).send({
        message: `City with id ${id} was deleted successfully!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete City with id " + id
    });
  }
});

module.exports = router;
