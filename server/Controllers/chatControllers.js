const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  try {
    // Find the chat where both users are participants
    let chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [req.user._id, userId] }
    })
    .populate("users", "-password")
    .populate("latestMessage");

    if (!chat) {
      // If chat doesn't exist, create a new one
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
        latestMessage:null,
      };

      chat = await Chat.create(chatData);
      // Populate users and latestMessage in the newly created chat
      chat = await chat.populate('users', '-password').populate('latestMessage').execPopulate();
    } else {
      // Populate sender information in latestMessage
      chat = await chat.populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "name email",
        }
      }).execPopulate();
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(400).send(error.message);
  }
});


const fetchChats = asyncHandler(async (req,res) => {
  
  try{
    console.log("req id" ,req);
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        console.log("results", results);
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name email",
        });
        console.log("updated result", results)
        res.status(200).send(results);
      });
  }catch(error){
    res.status(400);
    throw new Error(error.message);
  }
});
const fetchGroups = asyncHandler(async (req,res) => {
try{
  const allGroups = await Chat.where("isGroupChat").equals(true);
  res.status(200).json(allGroups);
  
}catch(error){
  res.status(400);
  throw new Error(error.message);
}
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.name || !req.body.users) {
    return res.status(400).send({ message: "Data is insufficient" });
  }

  try {
    let groupChat = await Chat.findOne({ isGroupChat: true, groupAdmin: req.user._id });

    if (!groupChat) {
      const data = {
        chatName: req.body.name,
        users: req.body.users,
        isGroupChat: true,
        groupAdmin: req.user._id,
        latestMessage: null,
      };

      groupChat = await Chat.create(data);
      groupChat = await groupChat.populate('users', '-password').populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "name email",
        }
      }).execPopulate();
    } else {
      groupChat = await groupChat.populate('users', '-password').populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "name email",
        }
      }).execPopulate();
    }

    res.status(200).json(groupChat);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = createGroupChat;



const groupExit = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

const addSelfToGroup = asyncHandler(async (req,res) => {
  const {chatId, userId} = req.body;

  const added = await Chat.findByIdAndUpdate(chatId,{$push: {users: userId}},{new:true,}
).populate("users", "-password").populate("groupAdmin", "-password");
  if(!added){
    res.status(404);
    throw new Error("Chat not found");
  }else{
    res.json(added);
  }
});

module.exports = {accessChat, fetchChats,fetchGroups ,createGroupChat,groupExit,addSelfToGroup};