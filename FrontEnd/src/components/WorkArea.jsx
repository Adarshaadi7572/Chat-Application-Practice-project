import React, { useContext, useEffect, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MessageSelf from "./MessageSelf";
import MessageOthers from "./MessageOthers";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import { io } from "socket.io-client"; // Import socket.io-client
import axios from "axios";
import { myContext } from "./MainContainer";
import { refreshSidebarFun } from "../Features/refreshSidebar";

const WorkArea = () => {
  const ENDPOINT = "https://chat-application-bcckend.onrender.com"; // Update with your server endpoint
  const lightTheme = useSelector((state) => state.themeKey);
  const [messageContent, setMessageContent] = useState('');
  const messagesEndRef = useRef(null);
  const dyParams = useParams();
  
  const [chat_id, chat_user] = dyParams._id.split('&');
  console.log("chatId" , chat_id);
  const userData = JSON.parse(localStorage.getItem('userData'));
  const [allMessages, setAllMessages] = useState([]);
  const [allMessageCopy, setAllMessageCopy] = useState([]);
  // const { refresh, setRefresh } = useContext(myContext);
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const [socketConnectionStatus, setConnectionStatus] = useState(false); // Define socket state
   const refreshkey = useSelector((state) => state.refreshKey);
  // Function to send message
    const socket = io("https://chat-application-bcckend.onrender.com");
const sendMessage = () => {
   
    console.log("messageConent" , messageContent);
    

    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };

    axios.post("https://chat-application-bcckend.onrender.com/message/", {
      content:messageContent,
      chatId:chat_id,
    }, config)
      .then((response) => {
        // data = response;
        console.log("Message sent successfully", response.data);
        socket.emit("newMessage", response.data); // Emit message through socket
      // Emit message through socket
      });
  };

  // Initialize socket connection
  useEffect(() => {
    socket.on("connect", () => {
      
      console.log("connected", socket.id);
      setConnectionStatus(!socketConnectionStatus); 
    });
    console.log("userData through socket", userData);
    socket.emit("setup", userData);
  }, [refreshkey]);

  //new message recieved
  useEffect(() => {
    socket.on("new message", (newMessage) => {
      console.log("new message", newMessage);
      setAllMessages((prevMessages) => [...prevMessages, newMessage]);
     
    });
  });
  
  // Fetch Chats on component load
  useEffect(() => {
     const socket = io(ENDPOINT);
    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`
      },
    };

    axios.get(`https://chat-application-bcckend.onrender.com/message/`+chat_id, config)
      .then(({ data }) => {
        console.log("data", data);
        setAllMessages(data);
        setLoaded(true);
          socket.emit('join chat', chat_id); // Emit join chat event through socket
      })
      .catch((error) => {
        console.log("Error fetching messages:", error);
      });
        // setAllMessageCopy(allMessages);
    // No need to setAllMessagesCopy here
  }, [refreshkey, chat_id, userData.token]);


  // Render loading skeleton if data is not loaded
  if (!loaded) {
    return (
      <div style={{
        border: '20px',
        padding: '10px',
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}>
        <Skeleton variant="rectangular" sx={{ width: "100%", borderRadius: "10px" }} height={60} />
        <Skeleton variant="rectangular" sx={{ width: "100%", borderRadius: "10px", flexGrow: '1' }} height={60} />
        <Skeleton variant="rectangular" sx={{ width: "100%", borderRadius: "10px" }} />
      </div>
    );
  }else{
    
  

  // Render chat area if data is loaded
  return (
    <div className='chatArea-container'>
      <div className={`chatArea-Header ${lightTheme ? 'bg-white' : 'bg-[#2d3941]'}`}>
        <p className='con-icon'>{chat_user[0]}</p>
        <div className='header-text'>
          <p className={`con-title ${lightTheme ? 'text-black' : 'text-white'}`}>{chat_user}</p>
          <p className='con-timeStamp'>{chat_user.timeStamp}</p>
        </div>
        <IconButton>
          <DeleteIcon className={`${lightTheme ? 'text-black' : 'text-white'}`} />
        </IconButton>
      </div>

      <div className={`messages-container ${lightTheme ? 'bg-white' : 'bg-[#2d3941]'}`}>
        {allMessages.slice(0).reverse().map((message, index) => {
          const sender = message.sender;
          const self_id = userData._id;
    
          if (sender._id === self_id) {
            return <MessageSelf props={message} key={index} />;
          } else {
            return <MessageOthers props={message} key={index} />;
          }
        })}
      </div>

      <div className={`text-input-area ${lightTheme ? 'bg-white' : 'bg-[#2d3941]'}`}>
        <input
          placeholder='Type a message'
          className={`search-box ${lightTheme ? 'bg-white text-black' : 'bg-[#2d3941] text-white'}`}
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.code === "Enter") {
              sendMessage();
              setMessageContent('');
               dispatch(refreshSidebarFun());
            }
          }}
        />
        <IconButton
          className={`icon ${lightTheme ? "" : ""}`}
          onClick={() => {
            sendMessage();
            setMessageContent('');
             dispatch(refreshSidebarFun());
          }}
        >
          <SendIcon />
        </IconButton>
      </div>
    </div>
  );
  }
};

export default WorkArea;
