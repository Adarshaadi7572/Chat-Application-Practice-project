const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const protect = asyncHandler(async (req, res, next) =>  {
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    try{
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    }catch(err){
      res.status(401).json({message:'Not Authorized'});
      throw new Error("Not authorised , token failed");
    }
  }
    if(!token){
      res.status(401).json({message:'Not Authorized'});
      throw new Error("Not authorised , no token");
    }
});
module.exports = {protect};