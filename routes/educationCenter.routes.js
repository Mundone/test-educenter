const { sequelize, DataTypes } = require("../db");
const EducationCenter = require("../models/models")(sequelize, DataTypes).EducationCenter;
const router = require("express").Router();

/**
 * @swagger
 * /educenters:
 *   get:
 *     summary: Retrieve all education centers
 *     tags: [Education Center]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EducationCenter'
 *       500:
 *         description: Internal Server Error
 */
router.get("/", async (req, res) => {
  try {
    // Fetch all records from the 'EducationCenters' table
    const educationCenters = await EducationCenter.findAll();
    
    res.send(educationCenters);
  } catch (err) {
    // If an error occurs during the fetch operation, send a server error response
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving education centers."
    });
  }
});

/**
 * @swagger
 * /educenters/{id}:
 *   get:
 *     summary: Retrieve a single education center by ID
 *     tags: [Education Center]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the education center
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EducationCenter'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", async (req, res) => {
  try {
    const educationCenter = await EducationCenter.findByPk(req.params.id);

    if (educationCenter) {
      res.send(educationCenter);
    } else {
      res.status(404).send({
        message: `Not found Education Center with id ${req.params.id}.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving the Education Center."
    });
  }
});

/**
 * @swagger
 * /educenters:
 *   post:
 *     summary: Create a new education center
 *     tags: [Education Center]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EducationCenter'
 *           examples:
 *             Example Education Center:
 *               value:
 *                 name: "New created Education Center"
 *                 description: "Newly created description"
 *                 image: "Newly created image.png"
 *                 createdAt: "2023-10-23 12:39"
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EducationCenter'
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
    const educationCenter = await EducationCenter.create(educationCenterData);

    // If the education center is successfully created, send back the new data.
    res.status(201).send(educationCenter);
  } catch (err) {
    // If there's an error, send back a 500 status and the error message.
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Education Center."
    });
  }
});

/**
 * @swagger
 * /educenters/{id}:
 *   put:
 *     tags: [Education Center]
 *     summary: "Update an education center by ID"
 *     description: "This endpoint updates an existing education center's information."
 *     operationId: "updateEducationCenter"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the education center to update"
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: "Education center data to update"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/EducationCenter"
 *     responses:
 *       200:
 *         description: "Education center updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/EducationCenter"
 *       400:
 *         description: "Invalid request"
 *       404:
 *         description: "Education center not found"
 *       500:
 *         description: "Error updating education center"
 */
router.put("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to update the education center
    const [updateResponse] = await EducationCenter.update(req.body, {
      where: { id: id }
    });

    if (updateResponse == 0) { // Check if the response is '0' (meaning no rows were updated) - this is Sequelize specific
      res.status(404).send({
        message: `Not found Education Center with id ${id}.`
      });
    } else {
      // If successful, retrieve the updated education center
      const updatedEducationCenter = await EducationCenter.findByPk(id);
      res.send(updatedEducationCenter);
    }
  } catch (err) {
    res.status(500).send({
      message: `Error updating Education Center with id ${id}`
    });
  }
});

/**
 * @swagger
 * /educenters/{id}:
 *   delete:
 *     summary: Delete an education center by its ID
 *     tags: [Education Center]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the education center to delete
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
 *                   example: Education Center was deleted successfully!
 *       404:
 *         description: Education center not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to delete the education center
    const numberOfDeletedRows = await EducationCenter.destroy({
      where: { id: id }
    });

    if (numberOfDeletedRows === 0) {
      res.status(404).send({
        message: `Not found Education Center with id ${id}.`
      });
    } else {
      res.status(200).send({
        message: `Education Center with id ${id} was deleted successfully!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete Education Center with id " + id
    });
  }
});

module.exports = router;
