import React, { useContext, useEffect } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NightlightIcon from '@mui/icons-material/Nightlight';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { IconButton } from '@mui/material';
import { refreshSidebarFun } from "../Features/refreshSidebar";
import { useNavigate } from 'react-router-dom';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../Features/themeSlice';
import LogoutIcon from '@mui/icons-material/Logout';
import { myContext } from './MainContainer';
import axios from 'axios';
const Sidebar = () => {

  const Navigate = useNavigate();
  const lightTheme = useSelector((state) => state.themeKey);
  // const {refresh, setRefresh} = useContext(myContext);
  const [conversations, setConversation] = useState([]);
  console.log("conversations", conversations);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const refreshkey = useSelector((state) => state.refreshKey);
  if (!userData) {
    console.log("User not Antheticated");
    Navigate("/");
  }
  const dispatch = useDispatch();

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`,

      }
    };
    axios.get("https://chat-application-bcckend.onrender.com/chat/", config).then((response) => {
      console.log("response data", response.data);

      setConversation(response.data);
    });
  }, [refreshkey]);

  return (
    <div className={'bg-[#f4f5f8] grow-[0.2] flex flex-col sidebar-container' + (lightTheme ? "" : " dark")}>
      <div className={` rounded-md py-[5px] px-[5px] m-[10px] flex items-center justify-between ${lightTheme ? "" : " dark"} sb-header`}>
        <div>
          <IconButton onClick={() => {
            Navigate("/app/welcome");
          }}>
            <AccountCircleIcon className={lightTheme ? "" : "text-white"} />
          </IconButton>
        </div>

        <div>

          <IconButton onClick={() => Navigate('users')} >
            <PersonAddIcon className={lightTheme ? "" : "text-white"} />
          </IconButton>
          <IconButton onClick={() => Navigate('groups')}>
            <GroupAddIcon className={lightTheme ? "" : "text-white"} />
          </IconButton>
          <IconButton onClick={() => Navigate('create-groups')}>
            <AddCircleIcon className={lightTheme ? "" : "text-white"} />
          </IconButton>
          <IconButton onClick={() => {
            dispatch(toggleTheme());
          }}>
            {
              lightTheme ? (<NightlightIcon />) : (<LightModeIcon className='text-white' />)
            }

          </IconButton>
          <IconButton onClick={() => Navigate('/')}>
            <LogoutIcon className={lightTheme ? "" : "text-white"} />
          </IconButton>
        </div>

      </div>
      <div className={`rounded-md py-[5px] px-[5px] m-[10px] flex items-center gap-1 ${lightTheme ? "" : "dark"} sb-search`}>
        <SearchIcon className={lightTheme ? '' : 'text-white'} />
        <input placeholder='Search' className={`border-none outline-none ${lightTheme ? "" : "dark text-white"}`} />
      </div>
      <div className={` rounded-md py-[5px] px-[5px] m-[10px] flex flex-col grow-[1] ${lightTheme ? `bg-white` : `dark`} sb-conversation`}>
        {conversations.map((conversation, index) => {
          console.log("conversation", conversation);
          // console.log("current convo : ", conversation);
          var chatName = "";
          if (conversation.isGroupChat) {
            chatName = conversation.chatName;
          } else {
            conversation.users.map((user) => {
              if (user._id != userData._id) {
                chatName = user.name;
              }
            });
          }
          if (conversation.latestMessage === null) {
            // console.log("No Latest Message with ", conversation.users[1]);
            return (
              <div
                key={index}
                onClick={() => {
                  console.log("Refresh fired from sidebar");
                  dispatch(refreshSidebarFun());

                }}
              >
                <div
                  key={index}
                  className="conversation-container"
                  onClick={() => {
                    Navigate(
                      "chat/" +
                      conversation._id +
                      "&" +
                      chatName
                    );
                  }}
                // dispatch change to refresh so as to update chatArea
                >
                  <p className={"con-icon" + (lightTheme ? "" : " dark")}>
                    {chatName[0]}
                  </p>
                  <p className={"con-title"}>
                    {chatName}
                  </p>

                  <p className="con-lastMessage">
                    No previous Messages, click here to start a new chat
                  </p>
                  {/* <p className={"con-timeStamp" + (lightTheme ? "" : " dark")}>
        {conversation.timeStamp}
      </p> */}
                </div>
              </div>
            );
          } else {
            return (
              <div
                key={index}
                className="conversation-container"
                onClick={() => {
                  Navigate(
                    "chat/" +
                    conversation._id +
                    "&" +
                    chatName
                  );
                }}
              >
                <p className={"con-icon" + (lightTheme ? "" : " dark")}>
                  {chatName[0]}
                </p>
                <p className={"con-title" + (lightTheme ? "" : " dark")}>
                  {chatName}
                </p>

                <p className="con-lastMessage">
                  {
                    conversation.latestMessage.content ? conversation.latestMessage.content : "No previous Messages"
                  }
                </p>
                {/* <p className={"con-timeStamp" + (lightTheme ? "" : " dark")}>
        {conversation.timeStamp}
      </p> */}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

export default Sidebar;
