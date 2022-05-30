/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *         description: Username
 *       email:
 *         type: string
 *         description: User email
 *       password:
 *         type: string
 *         description: User password
 *       role:
 *         type: string
 *         description: either admin or user
 *   updatedUser:
 *     type: object
 *     properties:
 *       email:
 *         type: string
 *         description: User email
 *       password:
 *         type: string
 *         description: User password
 *   JWT_signed_body:
 *     type: object
 *     properties:
 *       username:
 *         type: string
 *         description: Username
 *       token:
 *         type: string
 *         description: Signed JWT token
 *       image:
 *         type: string
 *         description: User profile photo
 *       status:
 *         type: string
 *         description: either online or offline
 */
