const { sequelize, DataTypes } = require("../db");
const Payment = require("../models/models")(sequelize, DataTypes).Payment;
const router = require("express").Router();

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Retrieve all payments
 *     tags: [Payment]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 *       500:
 *         description: Internal Server Error
 */
router.get("/", async (req, res) => {
  try {
    // Fetch all records from the 'Payments' table
    const payments = await Payment.findAll();
    
    res.send(payments);
  } catch (err) {
    // If an error occurs during the fetch operation, send a server error response
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving payments."
    });
  }
});

/**
 * @swagger
 * /payments/{id}:
 *   get:
 *     summary: Retrieve a single payment by ID
 *     tags: [Payment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the payment
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);

    if (payment) {
      res.send(payment);
    } else {
      res.status(404).send({
        message: `Not found Payment with id ${req.params.id}.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving the Payment."
    });
  }
});

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Create a new payment
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
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
    const payment = await Payment.create(educationCenterData);

    // If the payment is successfully created, send back the new data.
    res.status(201).send(payment);
  } catch (err) {
    // If there's an error, send back a 500 status and the error message.
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Payment."
    });
  }
});

/**
 * @swagger
 * /payments/{id}:
 *   put:
 *     tags:
 *       - Payment
 *     summary: "Update an payment by ID"
 *     description: "This endpoint updates an existing payment's information."
 *     operationId: "updateEducationCenter"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the payment to update"
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: "Education center data to update"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Payment"
 *     responses:
 *       200:
 *         description: "Education center updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Payment"
 *       400:
 *         description: "Invalid request"
 *       404:
 *         description: "Education center not found"
 *       500:
 *         description: "Error updating payment"
 */
router.put("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to update the payment
    const [updateResponse] = await Payment.update(req.body, {
      where: { id: id }
    });

    if (updateResponse == 0) { // Check if the response is '0' (meaning no rows were updated) - this is Sequelize specific
      res.status(404).send({
        message: `Not found Payment with id ${id}.`
      });
    } else {
      // If successful, retrieve the updated payment
      const updatedEducationCenter = await Payment.findByPk(id);
      res.send(updatedEducationCenter);
    }
  } catch (err) {
    res.status(500).send({
      message: `Error updating Payment with id ${id}`
    });
  }
});

/**
 * @swagger
 * /payments/{id}:
 *   delete:
 *     summary: Delete an payment by its ID
 *     tags: [Payment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the payment to delete
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
 *                   example: Payment was deleted successfully!
 *       404:
 *         description: Education center not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to delete the payment
    const numberOfDeletedRows = await Payment.destroy({
      where: { id: id }
    });

    if (numberOfDeletedRows === 0) {
      res.status(404).send({
        message: `Not found Payment with id ${id}.`
      });
    } else {
      res.status(200).send({
        message: `Payment with id ${id} was deleted successfully!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete Payment with id " + id
    });
  }
});

module.exports = router;
