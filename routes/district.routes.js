const { sequelize, DataTypes } = require("../db");
const District = require("../models/models")(sequelize, DataTypes).District;
const router = require("express").Router();

/**
 * @swagger
 * /districts:
 *   get:
 *     summary: Retrieve all districts
 *     tags: [District]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/District'
 *       500:
 *         description: Internal Server Error
 */
router.get("/", async (req, res) => {
  console.log(District);
  try {
    // Fetch all records from the 'Districts' table
    const districts = await District.findAll();
    
    res.send(districts);
  } catch (err) {
    // If an error occurs during the fetch operation, send a server error response
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving districts."
    });
  }
});

/**
 * @swagger
 * /districts/{id}:
 *   get:
 *     summary: Retrieve a single district by ID
 *     tags: [District]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the district
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/District'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", async (req, res) => {
  try {
    const district = await District.findByPk(req.params.id);

    if (district) {
      res.send(district);
    } else {
      res.status(404).send({
        message: `Not found District with id ${req.params.id}.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving the District."
    });
  }
});

/**
 * @swagger
 * /districts:
 *   post:
 *     summary: Create a new district
 *     tags: [District]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/District'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/District'
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
    const district = await District.create(educationCenterData);

    // If the district is successfully created, send back the new data.
    res.status(201).send(district);
  } catch (err) {
    // If there's an error, send back a 500 status and the error message.
    res.status(500).send({
      message: err.message || "Some error occurred while creating the District."
    });
  }
});

/**
 * @swagger
 * /districts/{id}:
 *   put:
 *     tags:
 *       - District
 *     summary: "Update an district by ID"
 *     description: "This endpoint updates an existing district's information."
 *     operationId: "updateEducationCenter"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the district to update"
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: "Education center data to update"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/District"
 *     responses:
 *       200:
 *         description: "Education center updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/District"
 *       400:
 *         description: "Invalid request"
 *       404:
 *         description: "Education center not found"
 *       500:
 *         description: "Error updating district"
 */
router.put("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to update the district
    const [updateResponse] = await District.update(req.body, {
      where: { id: id }
    });

    if (updateResponse == 0) { // Check if the response is '0' (meaning no rows were updated) - this is Sequelize specific
      res.status(404).send({
        message: `Not found District with id ${id}.`
      });
    } else {
      // If successful, retrieve the updated district
      const updatedEducationCenter = await District.findByPk(id);
      res.send(updatedEducationCenter);
    }
  } catch (err) {
    res.status(500).send({
      message: `Error updating District with id ${id}`
    });
  }
});

/**
 * @swagger
 * /districts/{id}:
 *   delete:
 *     summary: Delete an district by its ID
 *     tags: [District]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the district to delete
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
 *                   example: District was deleted successfully!
 *       404:
 *         description: Education center not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to delete the district
    const numberOfDeletedRows = await District.destroy({
      where: { id: id }
    });

    if (numberOfDeletedRows === 0) {
      res.status(404).send({
        message: `Not found District with id ${id}.`
      });
    } else {
      res.status(200).send({
        message: `District with id ${id} was deleted successfully!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete District with id " + id
    });
  }
});

module.exports = router;
