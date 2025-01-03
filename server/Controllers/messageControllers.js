const expressAsyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');

const allMessages = expressAsyncHandler(async (req, res) =>{
  try{
    const messages = await Message.find({chat:req.params.chatId})
      .populate("sender","name email");
      // .populate("receiver")
      // .populate("chat");
      res.json(messages);
  }catch(error){
    res.status(400).json({error:"Failed to get messages"});
  }
});

const sendMessages = expressAsyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    return res.status(400).json({ error: "chatId or content is not present" });
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);
//     console.log(message);
    message = await message.populate("sender", "name");
//     console.log( "part 1",message);


    message = await message.populate("chat");
//     message = await message.populate("receiver").execPopulate();
//     message = await User.populate(message, {
//       path: "chat.users",
//       select: "name email",
//     });
// console.log("message", message);
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    res.json(message);
    console.log("message", message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


module.exports = {allMessages, sendMessages};