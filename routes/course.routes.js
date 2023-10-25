const { sequelize, DataTypes } = require("../db");
const Course = require("../models/models")(sequelize, DataTypes).Course;
const router = require("express").Router();

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Retrieve all courses
 *     tags: [Course]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 *       500:
 *         description: Internal Server Error
 */
router.get("/", async (req, res) => {
  try {
    // Fetch all records from the 'Courses' table
    const courses = await Course.findAll();
    
    res.send(courses);
  } catch (err) {
    // If an error occurs during the fetch operation, send a server error response
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving courses."
    });
  }
});

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Retrieve a single course by ID
 *     tags: [Course]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the course
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (course) {
      res.send(course);
    } else {
      res.status(404).send({
        message: `Not found Course with id ${req.params.id}.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving the Course."
    });
  }
});

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Course]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
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
    const course = await Course.create(educationCenterData);

    // If the course is successfully created, send back the new data.
    res.status(201).send(course);
  } catch (err) {
    // If there's an error, send back a 500 status and the error message.
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Course."
    });
  }
});

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     tags:
 *       - Course
 *     summary: "Update an course by ID"
 *     description: "This endpoint updates an existing course's information."
 *     operationId: "updateEducationCenter"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the course to update"
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: "Education center data to update"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Course"
 *     responses:
 *       200:
 *         description: "Education center updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Course"
 *       400:
 *         description: "Invalid request"
 *       404:
 *         description: "Education center not found"
 *       500:
 *         description: "Error updating course"
 */
router.put("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to update the course
    const [updateResponse] = await Course.update(req.body, {
      where: { id: id }
    });

    if (updateResponse == 0) { // Check if the response is '0' (meaning no rows were updated) - this is Sequelize specific
      res.status(404).send({
        message: `Not found Course with id ${id}.`
      });
    } else {
      // If successful, retrieve the updated course
      const updatedEducationCenter = await Course.findByPk(id);
      res.send(updatedEducationCenter);
    }
  } catch (err) {
    res.status(500).send({
      message: `Error updating Course with id ${id}`
    });
  }
});

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Delete an course by its ID
 *     tags: [Course]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the course to delete
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
 *                   example: Course was deleted successfully!
 *       404:
 *         description: Education center not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to delete the course
    const numberOfDeletedRows = await Course.destroy({
      where: { id: id }
    });

    if (numberOfDeletedRows === 0) {
      res.status(404).send({
        message: `Not found Course with id ${id}.`
      });
    } else {
      res.status(200).send({
        message: `Course with id ${id} was deleted successfully!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete Course with id " + id
    });
  }
});

module.exports = router;
