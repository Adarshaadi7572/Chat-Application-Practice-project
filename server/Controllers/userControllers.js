const express = require('express');
const userModel = require('../models/userModel');
const expressAsyncHandler = require('express-async-handler');
const generateToken = require('../config/generateToken');

const loginController = expressAsyncHandler(async (req, res) => {
  try {
    const { name, password } = req.body;

    // Find user by name
    const user = await userModel.findOne({ name });

    // Check if user exists
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid password' });
      return;
    }

    // If user and password match, generate token and send response
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id) // Example: Generate token for authentication
    });

  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({ error: error.message });
  }
});

const registerController = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check for all fields
    if (!name || !email || !password) {
      res.status(400).json({ error: 'Please fill all the fields' });
      return;
    }

    // Check if user already exists by email
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    // Check if username already exists
    const userNameExists = await userModel.findOne({ name });
    if (userNameExists) {
      res.status(400).json({ error: 'Username already exists' });
      return;
    }

    // Create user in the database
    const user = await userModel.create({
      name,
      email,
      password
    });

    // Send a success response with user details and token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id) // Example: Generate token for authentication
    });

  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({ error: error.message });
  }
});

const fetchAllUsersController = expressAsyncHandler(async (req, res) => {
  console.log(req);
  const keyword = req.query.search ? {
    $or:[
      {name: {$regx: req.query.search, $options:'i'}},
      {email: {$regx: req.query.search, $options:'i'}},
    ]
  } : {};
  const users = await userModel.find(keyword).find({
    _id:{$ne:req.user._id},
  });
  res.send(users);
  
  
});

module.exports = { loginController, registerController,fetchAllUsersController };

