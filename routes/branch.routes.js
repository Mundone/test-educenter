const { sequelize, DataTypes } = require("../db");
const Branch = require("../models/models")(sequelize, DataTypes).Branch;
const router = require("express").Router();

/**
 * @swagger
 * /branches:
 *   get:
 *     summary: Retrieve all branches
 *     tags: [Branch]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Branch'
 *       500:
 *         description: Internal Server Error
 */
router.get("/", async (req, res) => {
    console.log(Branch);
  try {
    // Fetch all records from the 'Branches' table
    const branches = await Branch.findAll();
    
    res.send(branches);
  } catch (err) {
    // If an error occurs during the fetch operation, send a server error response
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving branches."
    });
  }
});

/**
 * @swagger
 * /branches/{id}:
 *   get:
 *     summary: Retrieve a single branch by ID
 *     tags: [Branch]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the branch
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", async (req, res) => {
  try {
    const branch = await Branch.findByPk(req.params.id);

    if (branch) {
      res.send(branch);
    } else {
      res.status(404).send({
        message: `Not found Branch with id ${req.params.id}.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving the Branch."
    });
  }
});

/**
 * @swagger
 * /branches:
 *   post:
 *     summary: Create a new branch
 *     tags: [Branch]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Branch'
 *           examples:
 *             Example Branch:
 *               value:
 *                 name: "New created Branch"
 *                 description: "Newly created description"
 *                 image: "Newly created image.png"
 *                 createdAt: "2023-10-23 12:39"
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

router.post("/", async (req, res) => {
  // Extracting data from the request body
  const branchData = req.body;

  try {
    // Directly using Sequelize's 'create' method. It returns a promise, 
    // which resolves with the created instance, hence we use 'await' here.
    const branch = await Branch.create(branchData);

    // If the branch is successfully created, send back the new data.
    res.status(201).send(branch);
  } catch (err) {
    // If there's an error, send back a 500 status and the error message.
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Branch."
    });
  }
});

/**
 * @swagger
 * /branches/{id}:
 *   put:
 *     tags: [Branch]
 *     summary: "Update an branch by ID"
 *     description: "This endpoint updates an existing branch's information."
 *     operationId: "updateBranch"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the branch to update"
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: "Branch data to update"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Branch"
 *     responses:
 *       200:
 *         description: "Branch updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Branch"
 *       400:
 *         description: "Invalid request"
 *       404:
 *         description: "Branch not found"
 *       500:
 *         description: "Error updating branch"
 */
router.put("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to update the branch
    const [updateResponse] = await Branch.update(req.body, {
      where: { id: id }
    });

    if (updateResponse == 0) { // Check if the response is '0' (meaning no rows were updated) - this is Sequelize specific
      res.status(404).send({
        message: `Not found Branch with id ${id}.`
      });
    } else {
      // If successful, retrieve the updated branch
      const updatedBranch = await Branch.findByPk(id);
      res.send(updatedBranch);
    }
  } catch (err) {
    res.status(500).send({
      message: `Error updating Branch with id ${id}`
    });
  }
});

/**
 * @swagger
 * /branches/{id}:
 *   delete:
 *     summary: Delete an branch by its ID
 *     tags: [Branch]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the branch to delete
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       200:
 *         description: Branch deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the successful deletion
 *                   example: Branch was deleted successfully!
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Attempt to delete the branch
    const numberOfDeletedRows = await Branch.destroy({
      where: { id: id }
    });

    if (numberOfDeletedRows === 0) {
      res.status(404).send({
        message: `Not found Branch with id ${id}.`
      });
    } else {
      res.status(200).send({
        message: `Branch with id ${id} was deleted successfully!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete Branch with id " + id
    });
  }
});

module.exports = router;
