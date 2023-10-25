const { sequelize, DataTypes } = require("../db");
const Worker = require("../models/models")(sequelize, DataTypes).Worker;
const router = require("express").Router();

/**
 * @swagger
 * /workers:
 *   get:
 *     summary: Retrieve all workers
 *     tags: [Worker]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Worker'
 *       500:
 *         description: Internal Server Error
 */
router.get("/", async (req, res) => {
  try {
    // Fetch all records from the 'Workers' table
    const workers = await Worker.findAll();
    
    res.send(workers);
  } catch (err) {
    // If an error occurs during the fetch operation, send a server error response
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving workers."
    });
  }
});

/**
 * @swagger
 * /workers/{id}:
 *   get:
 *     summary: Retrieve a single worker by ID
 *     tags: [Worker]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the worker
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Worker'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", async (req, res) => {
  try {
    const worker = await Worker.findByPk(req.params.id);

    if (worker) {
      res.send(worker);
    } else {
      res.status(404).send({
        message: `Not found Worker with id ${req.params.id}.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving the Worker."
    });
  }
});

/**
 * @swagger
 * /workers:
 *   post:
 *     summary: Create a new worker
 *     tags: [Worker]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Worker'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Worker'
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
    const worker = await Worker.create(educationCenterData);

    // If the worker is successfully created, send back the new data.
    res.status(201).send(worker);
  } catch (err) {
    // If there's an error, send back a 500 status and the error message.
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Worker."
    });
  }
});

/**
 * @swagger
 * /workers/{id}:
 *   put:
 *     tags:
 *       - Worker
 *     summary: "Update an worker by ID"
 *     description: "This endpoint updates an existing worker's information."
 *     operationId: "updateEducationCenter"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the worker to update"
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: "Education center data to update"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Worker"
 *     responses:
 *       200:
 *         description: "Education center updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Worker"
 *       400:
 *         description: "Invalid request"
 *       404:
 *         description: "Education center not found"
 *       500:
 *         description: "Error updating worker"
 */
router.put("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to update the worker
    const [updateResponse] = await Worker.update(req.body, {
      where: { id: id }
    });

    if (updateResponse == 0) { // Check if the response is '0' (meaning no rows were updated) - this is Sequelize specific
      res.status(404).send({
        message: `Not found Worker with id ${id}.`
      });
    } else {
      // If successful, retrieve the updated worker
      const updatedEducationCenter = await Worker.findByPk(id);
      res.send(updatedEducationCenter);
    }
  } catch (err) {
    res.status(500).send({
      message: `Error updating Worker with id ${id}`
    });
  }
});

/**
 * @swagger
 * /workers/{id}:
 *   delete:
 *     summary: Delete an worker by its ID
 *     tags: [Worker]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the worker to delete
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
 *                   example: Worker was deleted successfully!
 *       404:
 *         description: Education center not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to delete the worker
    const numberOfDeletedRows = await Worker.destroy({
      where: { id: id }
    });

    if (numberOfDeletedRows === 0) {
      res.status(404).send({
        message: `Not found Worker with id ${id}.`
      });
    } else {
      res.status(200).send({
        message: `Worker with id ${id} was deleted successfully!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete Worker with id " + id
    });
  }
});

module.exports = router;
