const { sequelize, DataTypes } = require("../db");
const Enrollment = require("../models/models")(sequelize, DataTypes).Enrollment;
const router = require("express").Router();

/**
 * @swagger
 * /enrollments:
 *   get:
 *     summary: Retrieve all enrollments
 *     tags: [Enrollment]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Enrollment'
 *       500:
 *         description: Internal Server Error
 */
router.get("/", async (req, res) => {
  try {
    // Fetch all records from the 'Enrollments' table
    const enrollments = await Enrollment.findAll();
    
    res.send(enrollments);
  } catch (err) {
    // If an error occurs during the fetch operation, send a server error response
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving enrollments."
    });
  }
});

/**
 * @swagger
 * /enrollments/{id}:
 *   get:
 *     summary: Retrieve a single enrollment by ID
 *     tags: [Enrollment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the enrollment
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrollment'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", async (req, res) => {
  try {
    const enrollment = await Enrollment.findByPk(req.params.id);

    if (enrollment) {
      res.send(enrollment);
    } else {
      res.status(404).send({
        message: `Not found Enrollment with id ${req.params.id}.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving the Enrollment."
    });
  }
});

/**
 * @swagger
 * /enrollments:
 *   post:
 *     summary: Create a new enrollment
 *     tags: [Enrollment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Enrollment'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrollment'
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
    const enrollment = await Enrollment.create(educationCenterData);

    // If the enrollment is successfully created, send back the new data.
    res.status(201).send(enrollment);
  } catch (err) {
    // If there's an error, send back a 500 status and the error message.
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Enrollment."
    });
  }
});

/**
 * @swagger
 * /enrollments/{id}:
 *   put:
 *     tags:
 *       - Enrollment
 *     summary: "Update an enrollment by ID"
 *     description: "This endpoint updates an existing enrollment's information."
 *     operationId: "updateEducationCenter"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the enrollment to update"
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: "Education center data to update"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Enrollment"
 *     responses:
 *       200:
 *         description: "Education center updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Enrollment"
 *       400:
 *         description: "Invalid request"
 *       404:
 *         description: "Education center not found"
 *       500:
 *         description: "Error updating enrollment"
 */
router.put("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to update the enrollment
    const [updateResponse] = await Enrollment.update(req.body, {
      where: { id: id }
    });

    if (updateResponse == 0) { // Check if the response is '0' (meaning no rows were updated) - this is Sequelize specific
      res.status(404).send({
        message: `Not found Enrollment with id ${id}.`
      });
    } else {
      // If successful, retrieve the updated enrollment
      const updatedEducationCenter = await Enrollment.findByPk(id);
      res.send(updatedEducationCenter);
    }
  } catch (err) {
    res.status(500).send({
      message: `Error updating Enrollment with id ${id}`
    });
  }
});

/**
 * @swagger
 * /enrollments/{id}:
 *   delete:
 *     summary: Delete an enrollment by its ID
 *     tags: [Enrollment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the enrollment to delete
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
 *                   example: Enrollment was deleted successfully!
 *       404:
 *         description: Education center not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to delete the enrollment
    const numberOfDeletedRows = await Enrollment.destroy({
      where: { id: id }
    });

    if (numberOfDeletedRows === 0) {
      res.status(404).send({
        message: `Not found Enrollment with id ${id}.`
      });
    } else {
      res.status(200).send({
        message: `Enrollment with id ${id} was deleted successfully!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete Enrollment with id " + id
    });
  }
});

module.exports = router;
