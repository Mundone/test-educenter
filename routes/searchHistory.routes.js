const { sequelize, DataTypes } = require("../db");
const SearchHistory = require("../models/models")(sequelize, DataTypes).SearchHistory;
const router = require("express").Router();

/**
 * @swagger
 * /searchHistories:
 *   get:
 *     summary: Retrieve all searchHistories
 *     tags: [SearchHistory]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SearchHistory'
 *       500:
 *         description: Internal Server Error
 */
router.get("/", async (req, res) => {
  try {
    // Fetch all records from the 'SearchHistories' table
    const searchHistories = await SearchHistory.findAll();
    
    res.send(searchHistories);
  } catch (err) {
    // If an error occurs during the fetch operation, send a server error response
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving searchHistories."
    });
  }
});

/**
 * @swagger
 * /searchHistories/{id}:
 *   get:
 *     summary: Retrieve a single searchHistory by ID
 *     tags: [SearchHistory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the searchHistory
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchHistory'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", async (req, res) => {
  try {
    const searchHistory = await SearchHistory.findByPk(req.params.id);

    if (searchHistory) {
      res.send(searchHistory);
    } else {
      res.status(404).send({
        message: `Not found SearchHistory with id ${req.params.id}.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving the SearchHistory."
    });
  }
});

/**
 * @swagger
 * /searchHistories:
 *   post:
 *     summary: Create a new searchHistory
 *     tags: [SearchHistory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SearchHistory'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchHistory'
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
    const searchHistory = await SearchHistory.create(educationCenterData);

    // If the searchHistory is successfully created, send back the new data.
    res.status(201).send(searchHistory);
  } catch (err) {
    // If there's an error, send back a 500 status and the error message.
    res.status(500).send({
      message: err.message || "Some error occurred while creating the SearchHistory."
    });
  }
});

/**
 * @swagger
 * /searchHistories/{id}:
 *   put:
 *     tags:
 *       - SearchHistory
 *     summary: "Update an searchHistory by ID"
 *     description: "This endpoint updates an existing searchHistory's information."
 *     operationId: "updateEducationCenter"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the searchHistory to update"
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: "Education center data to update"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/SearchHistory"
 *     responses:
 *       200:
 *         description: "Education center updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SearchHistory"
 *       400:
 *         description: "Invalid request"
 *       404:
 *         description: "Education center not found"
 *       500:
 *         description: "Error updating searchHistory"
 */
router.put("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to update the searchHistory
    const [updateResponse] = await SearchHistory.update(req.body, {
      where: { id: id }
    });

    if (updateResponse == 0) { // Check if the response is '0' (meaning no rows were updated) - this is Sequelize specific
      res.status(404).send({
        message: `Not found SearchHistory with id ${id}.`
      });
    } else {
      // If successful, retrieve the updated searchHistory
      const updatedEducationCenter = await SearchHistory.findByPk(id);
      res.send(updatedEducationCenter);
    }
  } catch (err) {
    res.status(500).send({
      message: `Error updating SearchHistory with id ${id}`
    });
  }
});

/**
 * @swagger
 * /searchHistories/{id}:
 *   delete:
 *     summary: Delete an searchHistory by its ID
 *     tags: [SearchHistory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the searchHistory to delete
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
 *                   example: SearchHistory was deleted successfully!
 *       404:
 *         description: Education center not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to delete the searchHistory
    const numberOfDeletedRows = await SearchHistory.destroy({
      where: { id: id }
    });

    if (numberOfDeletedRows === 0) {
      res.status(404).send({
        message: `Not found SearchHistory with id ${id}.`
      });
    } else {
      res.status(200).send({
        message: `SearchHistory with id ${id} was deleted successfully!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete SearchHistory with id " + id
    });
  }
});

module.exports = router;
