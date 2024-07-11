import React,{createContext} from 'react';
import Sidebar from './Sidebar';
import WorkArea from './WorkArea';
import {useState} from 'react';
import Welcome from './Welcome';
import CreateGroup from './CreateGroup';
import User_Groups from './User_Groups';
import "./component.css";
import { useSelector, useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
export const myContext = createContext();
const MainContainer = () => {
  const lightTheme = useSelector((state) => state.themeKey);
   const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(true);
  return(
    <div className={"bg-[#f4f5f8] h-[90vh] w-[90vw] flex " + (lightTheme ? "" : " dark")}>
      <myContext.Provider value={{ refresh: refresh, setRefresh: setRefresh }}>
        <Sidebar />
        <Outlet />
      </myContext.Provider>
    </div>
  )
}
export default MainContainer;