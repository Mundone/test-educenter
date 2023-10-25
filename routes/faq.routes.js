const { sequelize, DataTypes } = require("../db");
const Faq = require("../models/models")(sequelize, DataTypes).FAQ;
const router = require("express").Router();

/**
 * @swagger
 * /faqs:
 *   get:
 *     summary: Retrieve all faqs
 *     tags: [Faq]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Faq'
 *       500:
 *         description: Internal Server Error
 */
router.get("/", async (req, res) => {
  try {
    // Fetch all records from the 'Faqs' table
    const faqs = await Faq.findAll();
    
    res.send(faqs);
  } catch (err) {
    // If an error occurs during the fetch operation, send a server error response
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving faqs."
    });
  }
});

/**
 * @swagger
 * /faqs/{id}:
 *   get:
 *     summary: Retrieve a single faq by ID
 *     tags: [Faq]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the faq
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Faq'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", async (req, res) => {
  try {
    const faq = await Faq.findByPk(req.params.id);

    if (faq) {
      res.send(faq);
    } else {
      res.status(404).send({
        message: `Not found Faq with id ${req.params.id}.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving the Faq."
    });
  }
});

/**
 * @swagger
 * /faqs:
 *   post:
 *     summary: Create a new faq
 *     tags: [Faq]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Faq'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Faq'
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
    const faq = await Faq.create(educationCenterData);

    // If the faq is successfully created, send back the new data.
    res.status(201).send(faq);
  } catch (err) {
    // If there's an error, send back a 500 status and the error message.
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Faq."
    });
  }
});

/**
 * @swagger
 * /faqs/{id}:
 *   put:
 *     tags:
 *       - Faq
 *     summary: "Update an faq by ID"
 *     description: "This endpoint updates an existing faq's information."
 *     operationId: "updateEducationCenter"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the faq to update"
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: "Education center data to update"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Faq"
 *     responses:
 *       200:
 *         description: "Education center updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Faq"
 *       400:
 *         description: "Invalid request"
 *       404:
 *         description: "Education center not found"
 *       500:
 *         description: "Error updating faq"
 */
router.put("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to update the faq
    const [updateResponse] = await Faq.update(req.body, {
      where: { id: id }
    });

    if (updateResponse == 0) { // Check if the response is '0' (meaning no rows were updated) - this is Sequelize specific
      res.status(404).send({
        message: `Not found Faq with id ${id}.`
      });
    } else {
      // If successful, retrieve the updated faq
      const updatedEducationCenter = await Faq.findByPk(id);
      res.send(updatedEducationCenter);
    }
  } catch (err) {
    res.status(500).send({
      message: `Error updating Faq with id ${id}`
    });
  }
});

/**
 * @swagger
 * /faqs/{id}:
 *   delete:
 *     summary: Delete an faq by its ID
 *     tags: [Faq]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the faq to delete
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
 *                   example: Faq was deleted successfully!
 *       404:
 *         description: Education center not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to delete the faq
    const numberOfDeletedRows = await Faq.destroy({
      where: { id: id }
    });

    if (numberOfDeletedRows === 0) {
      res.status(404).send({
        message: `Not found Faq with id ${id}.`
      });
    } else {
      res.status(200).send({
        message: `Faq with id ${id} was deleted successfully!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete Faq with id " + id
    });
  }
});

module.exports = router;
