import './App.css'

import MainContainer from './components/MainContainer';
import Login from './components/Login';
import { Route, Routes } from 'react-router-dom';
import Welcome from './components/Welcome';
import CreateGroup from './components/CreateGroup';
import User_Groups from './components/User_Groups';
import WorkArea from './components/WorkArea';
import Groups from './components/Groups';

export default function App() {
  return (
    <main className='App' >

      {/* <MainContainer /> */}

      {/* <Login/> */}
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='app' element={<MainContainer />}>
          <Route path='Welcome' element={<Welcome />}></Route>
          <Route path='chat/:_id' element={<WorkArea/>}></Route>
          <Route path='users' element={<User_Groups />}></Route>
          <Route path='groups' element={<Groups/>}></Route>
          <Route path='create-groups' element={<CreateGroup/>}></Route>

        </Route>
      </Routes>
    </main>
  )
}
