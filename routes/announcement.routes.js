const { sequelize, DataTypes } = require("../db");
const Announcement = require("../models/models")(sequelize, DataTypes).Announcement;
const router = require("express").Router();

/**
 * @swagger
 * /announcements:
 *   get:
 *     summary: Retrieve all announcements
 *     tags: [Announcement]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Announcement'
 *       500:
 *         description: Internal Server Error
 */
router.get("/", async (req, res) => {
  try {
    // Fetch all records from the 'Announcements' table
    const announcements = await Announcement.findAll();
    
    res.send(announcements);
  } catch (err) {
    // If an error occurs during the fetch operation, send a server error response
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving announcements."
    });
  }
});

/**
 * @swagger
 * /announcements/{id}:
 *   get:
 *     summary: Retrieve a single announcement by ID
 *     tags: [Announcement]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the announcement
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Announcement'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", async (req, res) => {
  try {
    const announcement = await Announcement.findByPk(req.params.id);

    if (announcement) {
      res.send(announcement);
    } else {
      res.status(404).send({
        message: `Not found Announcement with id ${req.params.id}.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving the Announcement."
    });
  }
});

/**
 * @swagger
 * /announcements:
 *   post:
 *     summary: Create a new announcement
 *     tags: [Announcement]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Announcement'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Announcement'
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
    const announcement = await Announcement.create(educationCenterData);

    // If the announcement is successfully created, send back the new data.
    res.status(201).send(announcement);
  } catch (err) {
    // If there's an error, send back a 500 status and the error message.
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Announcement."
    });
  }
});

/**
 * @swagger
 * /announcements/{id}:
 *   put:
 *     tags:
 *       - Announcement
 *     summary: "Update an announcement by ID"
 *     description: "This endpoint updates an existing announcement's information."
 *     operationId: "updateEducationCenter"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the announcement to update"
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: "Education center data to update"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Announcement"
 *     responses:
 *       200:
 *         description: "Education center updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Announcement"
 *       400:
 *         description: "Invalid request"
 *       404:
 *         description: "Education center not found"
 *       500:
 *         description: "Error updating announcement"
 */
router.put("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to update the announcement
    const [updateResponse] = await Announcement.update(req.body, {
      where: { id: id }
    });

    if (updateResponse == 0) { // Check if the response is '0' (meaning no rows were updated) - this is Sequelize specific
      res.status(404).send({
        message: `Not found Announcement with id ${id}.`
      });
    } else {
      // If successful, retrieve the updated announcement
      const updatedEducationCenter = await Announcement.findByPk(id);
      res.send(updatedEducationCenter);
    }
  } catch (err) {
    res.status(500).send({
      message: `Error updating Announcement with id ${id}`
    });
  }
});

/**
 * @swagger
 * /announcements/{id}:
 *   delete:
 *     summary: Delete an announcement by its ID
 *     tags: [Announcement]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the announcement to delete
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
 *                   example: Announcement was deleted successfully!
 *       404:
 *         description: Education center not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to delete the announcement
    const numberOfDeletedRows = await Announcement.destroy({
      where: { id: id }
    });

    if (numberOfDeletedRows === 0) {
      res.status(404).send({
        message: `Not found Announcement with id ${id}.`
      });
    } else {
      res.status(200).send({
        message: `Announcement with id ${id} was deleted successfully!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete Announcement with id " + id
    });
  }
});

module.exports = router;
