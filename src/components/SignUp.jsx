import { Button } from '@mui/base';
import { TextField } from '@mui/material';
import React from 'react';
import Logo from '../../public/chat.png'
function SignUp(){
  return (
    <div className='login-container'>
     <div className='image-container'>
      <img src={Logo} alt='Logo' width='200px'/>
     </div>
      <div className='login-box'>
      <p className='login-text'>Create Your Account</p>
        <TextField id="standard-basic" label="Enter User Name" variant="standard" />
        <TextField id="standard-basic" type='email' label="Enter User Email" variant="standard"/>
         <TextField id="outlined-password-input" label="Password" type='password' variant="standard" />
        <Button variant="outlined">signUp</Button>
        <div>
          <p>Already have an Account ? <span className='underline text-blue-400'>Login</span></p>
        </div>
      </div>
    </div>
  )
}
export default SignUp;