import React from 'react';
import { json, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {motion} from 'framer-motion';
import logo from '../../public/chat.png';
function Welcome() {
  const lightTheme = useSelector((state) => state.themeKey);
  const userData = JSON.parse(localStorage.getItem("userData"));
  console.log(userData);
  const nav = useNavigate();
  if(!userData){
    console.log("User not Antheticated");
    nav("/");
  }
  return (
    <div className={"welcome-container justify-center" + (lightTheme ? "":"bg-[#2d3941]")}>
      
      <div className='flex flex-col items-center'>
      <motion.img drag whileTap={{scale:1.05, rotate:360}} src={logo} alt='logo' className='welcome-logo'/>
        <b>Hi, {userData.name}</b>
      <p className='text-center'>View and text directly to people present in the chat room</p>
      </div>
    </div>

  )
}
export default Welcome;