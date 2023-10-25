const { sequelize, DataTypes } = require("../db");
const Notification = require("../models/models")(sequelize, DataTypes).Notification;
const router = require("express").Router();

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Retrieve all notifications
 *     tags: [Notification]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       500:
 *         description: Internal Server Error
 */
router.get("/", async (req, res) => {
  console.log(Notification);
  try {
    // Fetch all records from the 'Cities' table
    const notifications = await Notification.findAll();
    
    res.send(notifications);
  } catch (err) {
    // If an error occurs during the fetch operation, send a server error response
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving notifications."
    });
  }
});

/**
 * @swagger
 * /notifications/{id}:
 *   get:
 *     summary: Retrieve a single notification by ID
 *     tags: [Notification]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the notification
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);

    if (notification) {
      res.send(notification);
    } else {
      res.status(404).send({
        message: `Not found Notification with id ${req.params.id}.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving the Notification."
    });
  }
});

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Create a new notification
 *     tags: [Notification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notification'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
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
    const notification = await Notification.create(educationCenterData);

    // If the notification is successfully created, send back the new data.
    res.status(201).send(notification);
  } catch (err) {
    // If there's an error, send back a 500 status and the error message.
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Notification."
    });
  }
});

/**
 * @swagger
 * /notifications/{id}:
 *   put:
 *     tags:
 *       - Notification
 *     summary: "Update an notification by ID"
 *     description: "This endpoint updates an existing notification's information."
 *     operationId: "updateEducationCenter"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the notification to update"
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: "Education center data to update"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Notification"
 *     responses:
 *       200:
 *         description: "Education center updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Notification"
 *       400:
 *         description: "Invalid request"
 *       404:
 *         description: "Education center not found"
 *       500:
 *         description: "Error updating notification"
 */
router.put("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to update the notification
    const [updateResponse] = await Notification.update(req.body, {
      where: { id: id }
    });

    if (updateResponse == 0) { // Check if the response is '0' (meaning no rows were updated) - this is Sequelize specific
      res.status(404).send({
        message: `Not found Notification with id ${id}.`
      });
    } else {
      // If successful, retrieve the updated notification
      const updatedEducationCenter = await Notification.findByPk(id);
      res.send(updatedEducationCenter);
    }
  } catch (err) {
    res.status(500).send({
      message: `Error updating Notification with id ${id}`
    });
  }
});

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Delete an notification by its ID
 *     tags: [Notification]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the notification to delete
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
 *                   example: Notification was deleted successfully!
 *       404:
 *         description: Education center not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to delete the notification
    const numberOfDeletedRows = await Notification.destroy({
      where: { id: id }
    });

    if (numberOfDeletedRows === 0) {
      res.status(404).send({
        message: `Not found Notification with id ${id}.`
      });
    } else {
      res.status(200).send({
        message: `Notification with id ${id} was deleted successfully!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete Notification with id " + id
    });
  }
});

module.exports = router;
