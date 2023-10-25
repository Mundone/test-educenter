const { sequelize, DataTypes } = require("../db");
const Review = require("../models/models")(sequelize, DataTypes).Review;
const router = require("express").Router();

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Retrieve all reviews
 *     tags: [Review]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       500:
 *         description: Internal Server Error
 */
router.get("/", async (req, res) => {
  try {
    // Fetch all records from the 'Reviews' table
    const reviews = await Review.findAll();
    
    res.send(reviews);
  } catch (err) {
    // If an error occurs during the fetch operation, send a server error response
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving reviews."
    });
  }
});

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Retrieve a single review by ID
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the review
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);

    if (review) {
      res.send(review);
    } else {
      res.status(404).send({
        message: `Not found Review with id ${req.params.id}.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving the Review."
    });
  }
});

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Review]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
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
    const review = await Review.create(educationCenterData);

    // If the review is successfully created, send back the new data.
    res.status(201).send(review);
  } catch (err) {
    // If there's an error, send back a 500 status and the error message.
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Review."
    });
  }
});

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     tags:
 *       - Review
 *     summary: "Update an review by ID"
 *     description: "This endpoint updates an existing review's information."
 *     operationId: "updateEducationCenter"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the review to update"
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: "Education center data to update"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Review"
 *     responses:
 *       200:
 *         description: "Education center updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Review"
 *       400:
 *         description: "Invalid request"
 *       404:
 *         description: "Education center not found"
 *       500:
 *         description: "Error updating review"
 */
router.put("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to update the review
    const [updateResponse] = await Review.update(req.body, {
      where: { id: id }
    });

    if (updateResponse == 0) { // Check if the response is '0' (meaning no rows were updated) - this is Sequelize specific
      res.status(404).send({
        message: `Not found Review with id ${id}.`
      });
    } else {
      // If successful, retrieve the updated review
      const updatedEducationCenter = await Review.findByPk(id);
      res.send(updatedEducationCenter);
    }
  } catch (err) {
    res.status(500).send({
      message: `Error updating Review with id ${id}`
    });
  }
});

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete an review by its ID
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the review to delete
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
 *                   example: Review was deleted successfully!
 *       404:
 *         description: Education center not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to delete the review
    const numberOfDeletedRows = await Review.destroy({
      where: { id: id }
    });

    if (numberOfDeletedRows === 0) {
      res.status(404).send({
        message: `Not found Review with id ${id}.`
      });
    } else {
      res.status(200).send({
        message: `Review with id ${id} was deleted successfully!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete Review with id " + id
    });
  }
});

module.exports = router;
