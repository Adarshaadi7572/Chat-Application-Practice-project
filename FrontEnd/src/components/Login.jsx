import React, { useState } from 'react';
import Logo from '../../public/chat.png';
import { TextField, Button, Backdrop, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Toaster from './Toaster';

function Login() {

  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [logInStatus, setLogInStatus] = useState("");
  const [signInStatus, setSignInStatus] = useState("");
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const [isVisible, setVisible] = useState(false);

  const loginHandler = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json"
        }
      };
        console.log(data);
      const response = await axios.post(
       "https://chat-application-bcckend.onrender.com/user/login",
        data,
        config
      );

      console.log("Login :", response);
      setLogInStatus({ msg: "success", key: Math.random() });
      setLoading(false);
      localStorage.setItem('userData', JSON.stringify(response.data));
      navigate("/app/welcome");
    } catch (err) {
      console.error("Error", err);
      if(err.response){
        
      console.log("Response Data", err.response.data);
      console.log("Response Status", err.response.status);
      }
      setLogInStatus({
        msg: "Invalid User name or password",
        key: Math.random()
      });
      setLoading(false);
    }
  };

  const signUpHandler = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          'Content-type': 'application/json'
        }
      };
     console.log(data);
      const response = await axios.post('https://chat-application-bcckend.onrender.com/user/signup', data, config);
      
      console.log('SignUp Response:', response);
      setSignInStatus({ msg: 'success', key: Math.random() });
      setLoading(false);
      localStorage.setItem('userData', JSON.stringify(response.data));
      navigate('/app/welcome');
    } catch (err) {
      console.error('Error signing up:', err);
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);

        let errorMsg = 'Error signing up. Please try again later.';
        if (err.response.status === 400) {
          errorMsg = err.response.data.error || 'Invalid data submitted.';
          // Handle specific validation errors or other types of errors
        } else if (err.response.status === 405) {
          errorMsg = 'User with this email already exists.';
          // Handle specific error scenarios
        }

        setSignInStatus({
          msg: errorMsg,
          key: Math.random(),
        });
      } else {
        setSignInStatus({
          msg: 'Network error occurred. Please check your connection.',
          key: Math.random(),
        });
      }
      setLoading(false);
    }
  };


  return (
    <>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="secondary" />
      </Backdrop>
      <div className='login-container'>
        <div className='image-container'>
          <img src={Logo} alt='Logo' width='200px' />
        </div>
        <div className={`login-box ${isVisible ? 'hidden' : ''}`}>
          <p className='login-text'>Login Your Account</p>
          <TextField id="standard-basic" label="Enter User Name" variant="standard" color='secondary' name="name" onChange={changeHandler} />
          <TextField id="outlined-password-input" label="Password" type='password' variant="standard" autoComplete="current-password" color='secondary' name='password' 
 onChange={changeHandler}/>
          <Button variant="outlined" color='secondary' onClick={loginHandler}>Login</Button>
          <div>
            <p>Don't have an Account ? <span className='text-blue-400 underline cursor-pointer' onClick={() => setVisible(true)}>Sign Up</span></p>
            {logInStatus ? (<Toaster key={logInStatus.key} msg={logInStatus.msg} />) : null}
          </div>
        </div>

        <div className={`login-box ${isVisible ? '' : 'hidden'}`}>
          <p className='login-text'>Create Your Account</p>
          <TextField id="standard-sign" label="Enter User Name" variant="standard" onChange={changeHandler} color='secondary' name='name' helperText="" />
          <TextField id="standard-sign-email" type='email' label="Enter User Email" variant="standard" onChange={changeHandler} color='secondary' name='email' helperText="" />
          <TextField id="signed-password-input" label="Password" type='password' variant="standard" autoComplete='current-password' color='secondary' name='password' onChange={changeHandler}/>
          <Button variant="outlined" color='secondary' onClick={signUpHandler}>Sign Up</Button>
          <div>
            <p>Already have an Account ? <span className='underline text-blue-400 cursor-pointer' onClick={() => setVisible(false)}>Login</span></p>
            {signInStatus ? (<Toaster key={signInStatus.key} msg={signInStatus.msg} />) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
