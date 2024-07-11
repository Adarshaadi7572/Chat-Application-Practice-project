import React from 'react';
import DoneOutlineRoundedIcon from "@mui/icons-material/DoneOutlineRounded";

import {IconButton,Button,Dialog,DialogActions,DialogContent,DialogContentText, DialogTitle} from '@mui/material';
import { useDispatch,useSelector } from 'react-redux';
// import {create} from '@mui/material/styles/createTransitions';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {useState} from 'react';

function CreateGroup(){
  const lightTheme = useSelector((state) => state.themeKey);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const nav = useNavigate();
  if(!userData){
    console.log("user not Antheticated");
    nav("/");
  }
  
  const [groupName, setGroupName] = useState("");
  const [open,setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  }
  console.log("User Data from CreateGroups :" , userData);
 const createGroup = () => {
   const config = {
     headers:{
       Authorization: `Bearer ${userData.token}`,
     },
   };
   axios.post("https://96e42177-e059-427f-8cd4-1f2c103f8c19-00-2nxrl19f3m7hh.sisko.replit.dev:5000/chat/createGroup", {name:groupName, users:[userData._id]},config).then((response) => {
     console.log("response after creating a group: ", response.data);
    
   }).catch((error) => {
     console.log("Unable to create a group: ", error);
   });
   nav("/app/groups");
 }

  return (
  <>
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to create a Group Named " + groupName}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This will create a create group in which you will be the admin and
            other will be able to join this group.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button
            onClick={() => {
              createGroup();
              handleClose();
            }}
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    <div className={"createGroups-container" + (lightTheme ? "" : " dark")}>
      <input
        placeholder="Enter Group Name"
        className={"search-box" + (lightTheme ? "" : " dark")}
        onChange={(e) => {
          setGroupName(e.target.value);
        }}
      />
      <IconButton
        className={"icon" + (lightTheme ? "" : " dark")}
        onClick={() => {
          handleClickOpen();
          // createGroup();
        }}
      >
        <DoneOutlineRoundedIcon />
      </IconButton>
    </div>

  </>
  )
}
export default CreateGroup;