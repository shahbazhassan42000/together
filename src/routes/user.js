import express from 'express';
import userController from '../controllers';
import auth from '../middlewares/auth';
import Role from '../utils/role';

const { Router } = express;
const { user } = userController;
const { authorize } = auth;
const { authenticate } = auth;

const api = Router();

api.post('/signin', user.signin);

/**
 * @swagger
 * /api/user:
 *   get:
 *     tags: ["Get all users"]
 *     description: Retrieves a list of JSON objects
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns a list of user objects
 *         schema:
 *           $ref: '#/definitions/User'
 */

// get all users
api.get('/', authenticate, authorize(Role.Admin), user.all);

/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     tags: ["Create a user"]
 *     description: create an object given in JSON format as in the body of the request
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters:
 *       - in: "body"
 *         name: "body"
 *         description: "user object that needs to be added to the user list"
 *         required: true
 *         schema:
 *           $ref: "#/definitions/User"
 *     responses:
 *       201:
 *         description: user object created successfully.
 *       404:
 *         description: user not found against given name
 *       400:
 *         description: ERROR!!! While creating user
 */
// create user
api.post('/signup', user.create);

/**
 * @swagger
 * /api/user/{name}:
 *   get:
 *     tags: ["Get a user by name"]
 *     description: Retrieves a JSON object against given name
 *     produces:
 *         - application/json
 *     parameters:
 *         - name: name
 *           in: path
 *           description: name of user to return
 *           required: true
 *           type: string
 *     responses:
 *       200:
 *         description: Returns a single user matched against given name
 *         schema:
 *           $ref: "#/definitions/User"
 *       404:
 *         description: user not found against given name
 *       400:
 *         description: ERROR!!! While getting user
 */
// Get a single user against given name
api.get('/:name', authenticate, user.one);

/**
 * @swagger
 * /api/user/{name}:
 *   put:
 *       tags: ["Update a user by name"]
 *       description: 'Update an existing user'
 *       consumes:
 *         - application/json
 *       produces:
 *         - application/json
 *       parameters:
 *         - name: name
 *           in: path
 *           description: name of user to return
 *           required: true
 *           type: string
 *         - in: body
 *           name: body
 *           description: user object that needs to be updated to the list
 *           required: true
 *           schema:
 *             $ref: '#/definitions/updatedUser'
 *       responses:
 *         '204':
 *           description: user updated successfully
 *         '404':
 *           description: user not found
 *         '400':
 *           description: ERROR!!! While updating user
 */
// update a single user against given name
api.put('/:name', authenticate, user.update);

/**
 * @swagger
 * /api/user/{name}:
 *   delete:
 *     tags: ["Delete a user by name"]
 *     description: Deletes a user
 *     produces:
 *         - application/json
 *     parameters:
 *         - name: name
 *           in: path
 *           description: name of user to delete
 *           required: true
 *           type: string
 *     responses:
 *         '204':
 *           description: user deleted successfully
 *         '404':
 *           description: user not found
 *         '400':
 *           description: ERROR!!! While deleting user
 */

// Delete a single user against given name
api.delete('/:name', authenticate, user.delete);

export default api;
