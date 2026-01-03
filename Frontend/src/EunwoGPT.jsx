import React from 'react'

import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { MyContext } from './components/MyContext';
import "./EunwoGPT.css";
import {v1 as uuidv1} from 'uuid';

import { useState } from 'react';

import LogSign from './components/LogSign.jsx';



function EunwoGPT() {

   const [prompt, setPrompt] = useState("");
   const [reply,setReply] =  useState(null);
   const [currThreadId, setCurrThreadId] = useState(uuidv1());
   const [prevChats, setPrevChats] = useState([]); 
   const [newChat, setNewChat] = useState(true);
   const [allThreads, setAllThreads] = useState([]);
   const [showSidebar, setShowSidebar] = useState(false);
   const [isLoggedIn, setIsLoggedIn]  = useState(false);
   const [isUser, setIsUser] = useState(false);
   const [isDropDownOpen, setIsDropDownOpen] = useState(false);
   const [logoutMsg, setLogoutMsg] = useState("");

  const providerValues = {
   prompt, setPrompt,
   reply, setReply,
   currThreadId, setCurrThreadId,
   newChat, setNewChat,
   prevChats, setPrevChats,
   allThreads, setAllThreads,
   showSidebar, setShowSidebar,
   isLoggedIn,setIsLoggedIn,
   isUser,setIsUser,
   isDropDownOpen, setIsDropDownOpen,
   logoutMsg, setLogoutMsg
  };

  return ( 
     <div className='app'>
 
           <MyContext.Provider value={providerValues}>
              {
                 isUser ?
                 <>
                  <Sidebar/>
                  <ChatWindow/>
                 </>
                :
               <LogSign></LogSign>
              }

              

           </MyContext.Provider>
         
     </div>
   );
}

export default EunwoGPT;