const express = require("express");
const Router = express.Router();

const {loginController,registerController, fetchAllUsersController} = require('../Controllers/userControllers');
const {protect} = require( '../middleware/authMiddleware');
Router.post('/login' , loginController);
Router.post('/signup' , registerController);
Router.get('/fetchUsers',protect, fetchAllUsersController);
module.exports = Router;