const { sequelize, DataTypes } = require("../db");
const Contract = require("../models/models")(sequelize, DataTypes).Contract;
const router = require("express").Router();

/**
 * @swagger
 * /contracts:
 *   get:
 *     summary: Retrieve all contracts
 *     tags: [Contract]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contract'
 *       500:
 *         description: Internal Server Error
 */
router.get("/", async (req, res) => {
  try {
    // Fetch all records from the 'Contracts' table
    const contracts = await Contract.findAll();
    
    res.send(contracts);
  } catch (err) {
    // If an error occurs during the fetch operation, send a server error response
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving contracts."
    });
  }
});

/**
 * @swagger
 * /contracts/{id}:
 *   get:
 *     summary: Retrieve a single contract by ID
 *     tags: [Contract]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the contract
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contract'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id);

    if (contract) {
      res.send(contract);
    } else {
      res.status(404).send({
        message: `Not found Contract with id ${req.params.id}.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving the Contract."
    });
  }
});

/**
 * @swagger
 * /contracts:
 *   post:
 *     summary: Create a new contract
 *     tags: [Contract]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contract'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contract'
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
    const contract = await Contract.create(educationCenterData);

    // If the contract is successfully created, send back the new data.
    res.status(201).send(contract);
  } catch (err) {
    // If there's an error, send back a 500 status and the error message.
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Contract."
    });
  }
});

/**
 * @swagger
 * /contracts/{id}:
 *   put:
 *     tags:
 *       - Contract
 *     summary: "Update an contract by ID"
 *     description: "This endpoint updates an existing contract's information."
 *     operationId: "updateEducationCenter"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the contract to update"
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: "Education center data to update"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Contract"
 *     responses:
 *       200:
 *         description: "Education center updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Contract"
 *       400:
 *         description: "Invalid request"
 *       404:
 *         description: "Education center not found"
 *       500:
 *         description: "Error updating contract"
 */
router.put("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to update the contract
    const [updateResponse] = await Contract.update(req.body, {
      where: { id: id }
    });

    if (updateResponse == 0) { // Check if the response is '0' (meaning no rows were updated) - this is Sequelize specific
      res.status(404).send({
        message: `Not found Contract with id ${id}.`
      });
    } else {
      // If successful, retrieve the updated contract
      const updatedEducationCenter = await Contract.findByPk(id);
      res.send(updatedEducationCenter);
    }
  } catch (err) {
    res.status(500).send({
      message: `Error updating Contract with id ${id}`
    });
  }
});

/**
 * @swagger
 * /contracts/{id}:
 *   delete:
 *     summary: Delete an contract by its ID
 *     tags: [Contract]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the contract to delete
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
 *                   example: Contract was deleted successfully!
 *       404:
 *         description: Education center not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to delete the contract
    const numberOfDeletedRows = await Contract.destroy({
      where: { id: id }
    });

    if (numberOfDeletedRows === 0) {
      res.status(404).send({
        message: `Not found Contract with id ${id}.`
      });
    } else {
      res.status(200).send({
        message: `Contract with id ${id} was deleted successfully!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete Contract with id " + id
    });
  }
});

module.exports = router;
