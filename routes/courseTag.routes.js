const { sequelize, DataTypes } = require("../db");
const CourseTag = require("../models/models")(sequelize, DataTypes).CourseTag;
const router = require("express").Router();

/**
 * @swagger
 * /courseTags:
 *   get:
 *     summary: Retrieve all courseTags
 *     tags: [CourseTag]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CourseTag'
 *       500:
 *         description: Internal Server Error
 */
router.get("/", async (req, res) => {
  try {
    // Fetch all records from the 'CourseTags' table
    const courseTags = await CourseTag.findAll();
    
    res.send(courseTags);
  } catch (err) {
    // If an error occurs during the fetch operation, send a server error response
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving courseTags."
    });
  }
});

/**
 * @swagger
 * /courseTags/{id}:
 *   get:
 *     summary: Retrieve a single courseTag by ID
 *     tags: [CourseTag]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the courseTag
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseTag'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", async (req, res) => {
  try {
    const courseTag = await CourseTag.findByPk(req.params.id);

    if (courseTag) {
      res.send(courseTag);
    } else {
      res.status(404).send({
        message: `Not found CourseTag with id ${req.params.id}.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving the CourseTag."
    });
  }
});

/**
 * @swagger
 * /courseTags:
 *   post:
 *     summary: Create a new courseTag
 *     tags: [CourseTag]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseTag'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseTag'
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
    const courseTag = await CourseTag.create(educationCenterData);

    // If the courseTag is successfully created, send back the new data.
    res.status(201).send(courseTag);
  } catch (err) {
    // If there's an error, send back a 500 status and the error message.
    res.status(500).send({
      message: err.message || "Some error occurred while creating the CourseTag."
    });
  }
});

/**
 * @swagger
 * /courseTags/{id}:
 *   put:
 *     tags:
 *       - CourseTag
 *     summary: "Update an courseTag by ID"
 *     description: "This endpoint updates an existing courseTag's information."
 *     operationId: "updateEducationCenter"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the courseTag to update"
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: "Education center data to update"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CourseTag"
 *     responses:
 *       200:
 *         description: "Education center updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CourseTag"
 *       400:
 *         description: "Invalid request"
 *       404:
 *         description: "Education center not found"
 *       500:
 *         description: "Error updating courseTag"
 */
router.put("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to update the courseTag
    const [updateResponse] = await CourseTag.update(req.body, {
      where: { id: id }
    });

    if (updateResponse == 0) { // Check if the response is '0' (meaning no rows were updated) - this is Sequelize specific
      res.status(404).send({
        message: `Not found CourseTag with id ${id}.`
      });
    } else {
      // If successful, retrieve the updated courseTag
      const updatedEducationCenter = await CourseTag.findByPk(id);
      res.send(updatedEducationCenter);
    }
  } catch (err) {
    res.status(500).send({
      message: `Error updating CourseTag with id ${id}`
    });
  }
});

/**
 * @swagger
 * /courseTags/{id}:
 *   delete:
 *     summary: Delete an courseTag by its ID
 *     tags: [CourseTag]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the courseTag to delete
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
 *                   example: CourseTag was deleted successfully!
 *       404:
 *         description: Education center not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to delete the courseTag
    const numberOfDeletedRows = await CourseTag.destroy({
      where: { id: id }
    });

    if (numberOfDeletedRows === 0) {
      res.status(404).send({
        message: `Not found CourseTag with id ${id}.`
      });
    } else {
      res.status(200).send({
        message: `CourseTag with id ${id} was deleted successfully!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete CourseTag with id " + id
    });
  }
});

module.exports = router;
