import React, { useContext, useEffect, useState } from "react";
import "./Sidebar.css";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
import server from './environment.js';

function Sidebar() {
  const {
    allThreads,
    setPrevChats,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    showSidebar,
    setShowSidebar,
    isUser,
    setIsUser,
    setIsLoggedIn,
    setIsDropDownOpen
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await fetch(`${server}/api/thread`, {
        credentials: "include"
      });

      if (response.status === 401) {
        setIsUser(false);
        setIsLoggedIn(false);
        setAllThreads([]);
        return;
      }

      const data = await response.json();
      if (!Array.isArray(data)) return;

      const filterData = data.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title
      }));

      setAllThreads(filterData);
    } catch (err) {
      console.log("Error fetching threads:", err);
    }
  };

  useEffect(() => {
    if (isUser) getAllThreads();
  }, [currThreadId, isUser]);

  const createNewChat = () => {
    if (showSidebar) setShowSidebar(false);
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);

    try {
      const response = await fetch(
        `${server}/api/thread/${newThreadId}`,
        { credentials: "include" }
      );

      if (response.status === 401) {
        setIsUser(false);
        setIsLoggedIn(false);
        setPrevChats([]);
        return;
      }

      const data = await response.json();
      setPrevChats(data);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log("Error fetching thread messages:", err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(
        `${server}/api/thread/${threadId}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      );

      if (response.status === 401) {
        setIsUser(false);
        setIsLoggedIn(false);
        setAllThreads([]);
        return;
      }

      const data = await response.json();
      console.log("Deleted thread:", data);

      if (currThreadId === threadId) {
        createNewChat();
      }
      await getAllThreads();
    } catch (err) {
      console.log("Error deleting thread:", err);
    }
  };

  return (
    <section className={`sidebar ${showSidebar ? "show" : "hide"}`} onClick={()=>setIsDropDownOpen(false)}>
      <button className="addNewChatBtn" onClick={createNewChat}>
        <img
          src="/assets/whiteLogo.png"
          alt="gpt logo"
          className="logo"
        />
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      <ul className="history">
        {allThreads.map((thread, idx) => (
          <li
            key={idx}
            onClick={() => changeThread(thread.threadId)}
            className={currThreadId === thread.threadId ? "highlighted" : ""}
          >
            {thread.title.slice(0, 25) + "..."}
            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      <div className="sign">
        <p>By Saurav Singh Mehta &hearts;</p>
      </div>
    </section>
  );
}

export default Sidebar;
