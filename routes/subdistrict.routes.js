const { sequelize, DataTypes } = require("../db");
const Subdistrict = require("../models/models")(sequelize, DataTypes).Subdistrict;
const router = require("express").Router();

/**
 * @swagger
 * /subdistricts:
 *   get:
 *     summary: Retrieve all subdistricts
 *     tags: [Subdistrict]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subdistrict'
 *       500:
 *         description: Internal Server Error
 */
router.get("/", async (req, res) => {
  console.log(Subdistrict);
  try {
    // Fetch all records from the 'Districts' table
    const subdistricts = await Subdistrict.findAll();
    
    res.send(subdistricts);
  } catch (err) {
    // If an error occurs during the fetch operation, send a server error response
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving subdistricts."
    });
  }
});

/**
 * @swagger
 * /subdistricts/{id}:
 *   get:
 *     summary: Retrieve a single subdistricts by ID
 *     tags: [Subdistrict]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the subdistricts
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subdistrict'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", async (req, res) => {
  try {
    const subdistricts = await Subdistrict.findByPk(req.params.id);

    if (subdistricts) {
      res.send(subdistricts);
    } else {
      res.status(404).send({
        message: `Not found Subdistrict with id ${req.params.id}.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving the Subdistrict."
    });
  }
});

/**
 * @swagger
 * /subdistricts:
 *   post:
 *     summary: Create a new subdistricts
 *     tags: [Subdistrict]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subdistrict'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subdistrict'
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
    const subdistricts = await Subdistrict.create(educationCenterData);

    // If the subdistricts is successfully created, send back the new data.
    res.status(201).send(subdistricts);
  } catch (err) {
    // If there's an error, send back a 500 status and the error message.
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Subdistrict."
    });
  }
});

/**
 * @swagger
 * /subdistricts/{id}:
 *   put:
 *     tags:
 *       - Subdistrict
 *     summary: "Update an subdistricts by ID"
 *     description: "This endpoint updates an existing subdistricts's information."
 *     operationId: "updateEducationCenter"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the subdistricts to update"
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: "Education center data to update"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Subdistrict"
 *     responses:
 *       200:
 *         description: "Education center updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Subdistrict"
 *       400:
 *         description: "Invalid request"
 *       404:
 *         description: "Education center not found"
 *       500:
 *         description: "Error updating subdistricts"
 */
router.put("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to update the subdistricts
    const [updateResponse] = await Subdistrict.update(req.body, {
      where: { id: id }
    });

    if (updateResponse == 0) { // Check if the response is '0' (meaning no rows were updated) - this is Sequelize specific
      res.status(404).send({
        message: `Not found Subdistrict with id ${id}.`
      });
    } else {
      // If successful, retrieve the updated subdistricts
      const updatedEducationCenter = await Subdistrict.findByPk(id);
      res.send(updatedEducationCenter);
    }
  } catch (err) {
    res.status(500).send({
      message: `Error updating Subdistrict with id ${id}`
    });
  }
});

/**
 * @swagger
 * /subdistricts/{id}:
 *   delete:
 *     summary: Delete an subdistricts by its ID
 *     tags: [Subdistrict]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the subdistricts to delete
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
 *                   example: Subdistrict was deleted successfully!
 *       404:
 *         description: Education center not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to delete the subdistricts
    const numberOfDeletedRows = await Subdistrict.destroy({
      where: { id: id }
    });

    if (numberOfDeletedRows === 0) {
      res.status(404).send({
        message: `Not found Subdistrict with id ${id}.`
      });
    } else {
      res.status(200).send({
        message: `Subdistrict with id ${id} was deleted successfully!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete Subdistrict with id " + id
    });
  }
});

module.exports = router;
