import React, { useContext, useEffect, useState } from "react";

import SearchIcon from "@mui/icons-material/Search";
import { IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import Logo from '../../public/chat.png';
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { refreshSidebarFun } from "../Features/refreshSidebar";
import { myContext } from "./MainContainer";

function User_Groups(){
  const { refresh, setRefresh } = useContext(myContext);
  const lightTheme = useSelector((state) => state.themeKey);
  const [users, setUsers] = useState([])
  const userData = JSON.parse(localStorage.getItem("userData"));
   const dispatch = useDispatch();
  const nav = useNavigate();
   const refreshkey = useSelector((state) => state.refreshKey)
  if(!userData){
    console.log("User not Antheticated");
    nav(-1);
  }
 
  useEffect(() => {
    console.log("users refreshed");
    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`
      },
    };
  
  axios.get("https://96e42177-e059-427f-8cd4-1f2c103f8c19-00-2nxrl19f3m7hh.sisko.replit.dev:5000/user/fetchUsers", config).then((data) => {
    console.log("userData from API", data.data);
    setUsers(data.data);
  });
},[refreshkey]);
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{
          duration: "0.3",
        }}
        className="list-container"
      >
        <div className={"ug-header" + (lightTheme ? "" : " dark")}>
          <img
            src={Logo}
            style={{ height: "2rem", width: "2rem", marginLeft: "10px" }}
          />
          <p className={"ug-title" + (lightTheme ? "" : " dark")}>
            Available Users
          </p>
          <IconButton
            className={"icon" + (lightTheme ? "" : " dark")}
            onClick={() => {
              dispatch(refreshSidebarFun());
              console.log(refreshkey);
            }}
          >
            <RefreshIcon />
          </IconButton>
        </div>
        <div className={"sb-search" + (lightTheme ? "" : " dark")}>
          <IconButton className={"icon" + (lightTheme ? "" : " dark")}>
            <SearchIcon />
          </IconButton>
          <input
            placeholder="Search"
            className={"search-box" + (lightTheme ? "" : " dark")}
          />
        </div>
        <div className="ug-list">
          {users.map((user, index) => {
        if(user._id != userData._id){
          
            return (
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={"list-tem" + (lightTheme ? "" : " dark")}
                key={index}
                onClick={() => {
                  console.log("Creating chat with ", userData.name);
                  const config = {
                    headers: {
                      Authorization: `Bearer ${userData.token}`,
                    },
                  };
                  axios.post(
                    "https://96e42177-e059-427f-8cd4-1f2c103f8c19-00-2nxrl19f3m7hh.sisko.replit.dev:5000/chat/",
                    {
                      userId: user._id,
                    },
                    config
                  );
                  dispatch(refreshSidebarFun());
                }}
              >
                <p className={"con-icon" + (lightTheme ? "" : " dark")}>T</p>
                <p className={"con-title" + (lightTheme ? "" : " dark")}>
                  {user.name}
                </p>
              </motion.div>
            );
        }
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
export default User_Groups;