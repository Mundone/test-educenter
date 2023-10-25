const { sequelize, DataTypes } = require("../db");
const CourseTagMapping = require("../models/models")(sequelize, DataTypes).CourseTagMapping;
const router = require("express").Router();

/**
 * @swagger
 * /courseTagMappings:
 *   get:
 *     summary: Retrieve all courseTagMappings
 *     tags: [CourseTagMapping]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CourseTagMapping'
 *       500:
 *         description: Internal Server Error
 */
router.get("/", async (req, res) => {
  try {
    // Fetch all records from the 'CourseTags' table
    const courseTagMappings = await CourseTagMapping.findAll();
    
    res.send(courseTagMappings);
  } catch (err) {
    // If an error occurs during the fetch operation, send a server error response
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving courseTagMappings."
    });
  }
});

/**
 * @swagger
 * /courseTagMappings/{id}:
 *   get:
 *     summary: Retrieve a single courseTagMapping by ID
 *     tags: [CourseTagMapping]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the courseTagMapping
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseTagMapping'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", async (req, res) => {
  try {
    const courseTagMapping = await CourseTagMapping.findByPk(req.params.id);

    if (courseTagMapping) {
      res.send(courseTagMapping);
    } else {
      res.status(404).send({
        message: `Not found CourseTagMapping with id ${req.params.id}.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving the CourseTagMapping."
    });
  }
});

/**
 * @swagger
 * /courseTagMappings:
 *   post:
 *     summary: Create a new courseTagMapping
 *     tags: [CourseTagMapping]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseTagMapping'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseTagMapping'
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
    const courseTagMapping = await CourseTagMapping.create(educationCenterData);

    // If the courseTagMapping is successfully created, send back the new data.
    res.status(201).send(courseTagMapping);
  } catch (err) {
    // If there's an error, send back a 500 status and the error message.
    res.status(500).send({
      message: err.message || "Some error occurred while creating the CourseTagMapping."
    });
  }
});

/**
 * @swagger
 * /courseTagMappings/{id}:
 *   put:
 *     tags:
 *       - CourseTagMapping
 *     summary: "Update an courseTagMapping by ID"
 *     description: "This endpoint updates an existing courseTagMapping's information."
 *     operationId: "updateEducationCenter"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the courseTagMapping to update"
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: "Education center data to update"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CourseTagMapping"
 *     responses:
 *       200:
 *         description: "Education center updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CourseTagMapping"
 *       400:
 *         description: "Invalid request"
 *       404:
 *         description: "Education center not found"
 *       500:
 *         description: "Error updating courseTagMapping"
 */
router.put("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to update the courseTagMapping
    const [updateResponse] = await CourseTagMapping.update(req.body, {
      where: { id: id }
    });

    if (updateResponse == 0) { // Check if the response is '0' (meaning no rows were updated) - this is Sequelize specific
      res.status(404).send({
        message: `Not found CourseTagMapping with id ${id}.`
      });
    } else {
      // If successful, retrieve the updated courseTagMapping
      const updatedEducationCenter = await CourseTagMapping.findByPk(id);
      res.send(updatedEducationCenter);
    }
  } catch (err) {
    res.status(500).send({
      message: `Error updating CourseTagMapping with id ${id}`
    });
  }
});

/**
 * @swagger
 * /courseTagMappings/{id}:
 *   delete:
 *     summary: Delete an courseTagMapping by its ID
 *     tags: [CourseTagMapping]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the courseTagMapping to delete
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
 *                   example: CourseTagMapping was deleted successfully!
 *       404:
 *         description: Education center not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to delete the courseTagMapping
    const numberOfDeletedRows = await CourseTagMapping.destroy({
      where: { id: id }
    });

    if (numberOfDeletedRows === 0) {
      res.status(404).send({
        message: `Not found CourseTagMapping with id ${id}.`
      });
    } else {
      res.status(200).send({
        message: `CourseTagMapping with id ${id} was deleted successfully!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete CourseTagMapping with id " + id
    });
  }
});

module.exports = router;
