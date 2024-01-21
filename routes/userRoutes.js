// Import the Express framework
import express from 'express';

// Import controller functions for handling user-related operations
import {
  createUser,
  getAllUsers,
  findUserById,
  updateUser,
  deleteUser,
  loginUser,
  getMe
} from "../controllers/userController.js";

// Import the protect middleware for route protection with JWT authentication
import protect from '../middleware/authMiddleware.js';

// Create an instance of the Express Router
const router = express.Router();

// Define routes and associated middleware/handlers

// POST route to create a new user
router.post('/users', createUser);

// POST route to handle user login
router.post('/users/login', loginUser);

// GET route to retrieve the currently authenticated user, protected by JWT authentication
router.get('/users/s/me', protect, getMe);

// GET route to retrieve all users
router.get('/users', getAllUsers);

// GET route to retrieve a specific user by ID
router.get('/users/:id', findUserById);

// PUT route to update a specific user by ID
router.put('/users',protect, updateUser);

// DELETE route to delete a specific user by ID
router.delete('/users/:id', deleteUser);

// Export the configured router for use in other files
export default router;
