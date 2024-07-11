import React, { useContext, useEffect, useState } from "react";

import SearchIcon from "@mui/icons-material/Search";
import { IconButton } from "@mui/material";
import Logo from '../../public/chat.png';
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { refreshSidebarFun } from "../Features/refreshSidebar";
import { myContext } from "./MainContainer";

function Groups(){
  const lightTheme = useSelector((state) => state.themeKey);
  const dispatch = useDispatch();
   const { refresh, setRefresh } = useContext(myContext);
  const [groups, setGroups] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const nav = useNavigate();

  if(!userData){
    console.log("User not Authenticated");
    nav("/");
  }


  useEffect(() => {
    const config = {
      headers:{
        Authorization: `Bearer ${userData.token}`
      },
    };
    axios.get("https://96e42177-e059-427f-8cd4-1f2c103f8c19-00-2nxrl19f3m7hh.sisko.replit.dev:5000/chat/fetchGroups", config).then((response) => {
      setGroups(response.data);
    });
  }, [refresh]);
  return (
    <AnimatePresence>
    <motion.div initial={{opacity:0,scale:0}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0}} transition={{
       duration: "0.3"
    }} className='list-container'>
      <div className={'ug-header' + (lightTheme ? '':'bg-[#2d3941]')}>
        <img src={Logo} style={{height:'2rem', width:"2rem"}}/>
        <p className={'ug-title' + (lightTheme ? '':'bg-[#2d3941]')}>Availible Groups</p>
        <IconButton className={"icon" + (lightTheme ? '' : 'bg-[#2d3941]')} onClick={()=>{
       setRefresh(!refresh);
        }}>
         <RefreshIcon/>
        </IconButton>
      </div>

      <div className={'sb-search' +(lightTheme ? '': 'bg-[#2d3941]')}>
        <IconButton className={'icon' + (lightTheme ? '':'bg-[#2d3941]')}>
          <SearchIcon/>
        </IconButton>
        <input placeholder='Search' className={'search-box' + (lightTheme ? '':'bg-[#2d3941]')}/>
      </div>
      <div className='ug-list'>
        {groups.map((group,index) => {
          return (
            <motion.div 
              key={index} 
               className={"list-tem" + (lightTheme ? "" : " dark")}
              whileHover={{scale:1.01}}
              
              onClick={()=>{
                console.log("creating chat with", user.name);
                const config={
                  headers:{
                    Authorization: `Bearer ${userData.token}`
                  },
                };
                axios.put(
                  "https://96e42177-e059-427f-8cd4-1f2c103f8c19-00-2nxrl19f3m7hh.sisko.replit.dev:5000/chat/addSelfToGroup",
                  {
                    chatId: group._id,
                    userId:userData._id
                  },
                  config
                );
                dispatch(refreshSidebarFun());
              }}>
              <p className='con-icon'>{group.chatName[0]}</p>
              <p className='con-title'>{group.chatName}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
       </AnimatePresence>
  )
}
export default Groups;