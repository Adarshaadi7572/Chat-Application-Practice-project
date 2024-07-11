const express = require('express');
const dotenv = require('dotenv');
const { default: mongoose } = require('mongoose');
const userRoutes = require('./Routes/userRoutes');
const chatRoutes = require('./Routes/chatRoutes');
const messageRoutes = require('./Routes/messageRoutes');
const cors = require('cors');
const {notFound, errorHandler} = require('./middleware/errorMiddleware');

const app = express();
dotenv.config();

// app.use(
//   cors({
//     origin: '*',
//     credentials: true,
//   })
// )

const corsOptions = {
  origin: '*', // Replace with your frontend URL
  credentials: true, // Allow cookies or tokens to be sent
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use(express.json());
app.use('/user', userRoutes);
app.use('/chat', chatRoutes);
app.use('/message', messageRoutes);


const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URL);
    console.log('Server is connected to database');
  } catch (err) {
    console.error('Server failed to connect to the database:', err.message);
  }
};

connectDb();
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = require("socket.io")(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,

});

io.on("connection", (socket) => {
   socket.on("setup",(user) => {
     console.log("User Connected", user);
     socket.join(user._id);
     console.log(`User joined self room ${user._id}`);
     socket.emit("connected");
   });
  
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`User joined room ${room}`);
  });

  socket.on("newMessage", (newMessageStatus) => {
    console.log("new message from socket",newMessageStatus);
    var chat = newMessageStatus.chat;
    if(!chat.users){
      return console.log("chat.users not defined");
    }
    chat.users.forEach((user) => {
      console.log("this is user",user);
      if(user == newMessageStatus.sender._id) return;
      
      socket.in(user).emit("new message", newMessageStatus);
    });
    
  });
});

