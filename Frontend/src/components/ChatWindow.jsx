import React, { useContext, useEffect, useState, useRef } from "react";
import "./Chatwindow.css";
import Chat from "./Chat.jsx";
import { ScaleLoader, BeatLoader , CircleLoader} from "react-spinners";
import { MyContext } from "./MyContext.jsx";
// import { Backgrounds } from "../assets/assests.js";
import server from './environment.js';

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setPrevChats,
    setNewChat,
    setShowSidebar,
    isLoggedIn,
    setIsLoggedIn,
    isUser,
    setIsUser,
    isDropDownOpen,
    setIsDropDownOpen,
    setLogoutMsg,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [theme, setTheme] = useState(null);

  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const videoRef = useRef(null);
  const recognitionRef = useRef(null);

  const getReply = async () => {
    if (!isUser) return;
    document.querySelector(".input").style.height = "auto";
    setNewChat(false);

    try {
      setLoading(true);
      const response = await fetch(`${server}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: prompt, threadId: currThreadId }),
      });

      setLoading(false);

      if (response.status === 401) {
        setIsUser(false);
        setIsLoggedIn(false);
        return;
      }

      const data = await response.json();
      setReply(data.reply);
    } catch (err) {
      setLoading(false);
      console.error("Chat API error:", err);
    }
  };

  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prev) => [
        ...prev,
        { role: "user", content: prompt },
        { role: "assistant", content: reply },
      ]);
      setPrompt("");
    }
  }, [reply]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      const result = await fetch(`${server}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      const res = await result.json();

      setIsUser(false);
      setIsLoggedIn(false);
      setLogoutMsg(res.message);
      setTimeout(() => setLogoutMsg(""), 2000);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLogoutLoading(false);
    }
  };

  const changeTheme = () => {
    const themes = [
      null,
      // Backgrounds.blue,
      // Backgrounds.water,
      // Backgrounds.cat,
      // Backgrounds.bgVideo,
      // Backgrounds.ghostsmoke,
      // Backgrounds.lightBg,
    ];
    setIndex((prev) => {
      const next = (prev + 1) % themes.length;
      setTheme(themes[next]);
      return next;
    });
  };

  useEffect(() => {
    if (videoRef.current) videoRef.current.load();
  }, [theme]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    setSpeechSupported(true);

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setPrompt((prev) => (prev ? prev + " " + text : text));
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;

  }, []);

  const startMic = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  return (
    <>
      <div
        className="videoDiv"
        onClick={() => {
          setIsDropDownOpen(false);
          setShowSidebar(false);
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="video"
          preload="metadata"
        >
          {theme && <source src={theme} type="video/mp4" />}
        </video>
      </div>

      <div
        className="chatWindow"
        onClick={() => {
          setIsDropDownOpen(false);
          setShowSidebar(false);
        }}
      >
        <div className="navbar">
          <span
            className="showSidebarIcon"
            onClick={(e) => {
              e.stopPropagation();
              setShowSidebar((prev) => !prev);
              setIsDropDownOpen(false);
            }}
          >
            <i className="fa-solid fa-bars-staggered"></i>
          </span>

          <span className="EunwoGPTName">
            EunwoGPT <i className="fa-solid fa-chevron-down"></i>
          </span>

          <div className="userIconDiv">
            <span className="themeIcon" onClick={changeTheme}>
              <i className="fa-solid fa-droplet"></i>
            </span>
            <span
              className="userIcon"
              onClick={(e) => {
                e.stopPropagation();
                setIsDropDownOpen(!isDropDownOpen);
                setShowSidebar(false);
              }}
            >
              <i className="fa-solid fa-user"></i>
            </span>
          </div>
        </div>

        {isDropDownOpen && (
          <div className="dropDown" onClick={(e) => e.stopPropagation()}>
            <div className="dropDownItem">
              <i className="fa-solid fa-gear"></i>settings
            </div>
            <div className="dropDownItem">
              <i className="fa-solid fa-cloud-arrow-up"></i>upgrade plan
            </div>
            <div className="dropDownItem" onClick={handleLogout}>
              <i className="fa-solid fa-arrow-right-from-bracket"></i>log out
            </div>
            {logoutLoading && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <BeatLoader color="white" loading />
              </div>
            )}
          </div>
        )}

        <Chat />
        <ScaleLoader color="white" loading={loading} />

        <div className="chatInput">
          <div className="inputBox" style={{ position: "relative" }}>
            <textarea
              className="input"
              rows={1}
              placeholder="Ask anything"
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 250) + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (prompt.trim()) getReply();
                }
              }}
            />

            {(speechSupported && prompt.trim().length===0) && (
              <div
                onClick={startMic}
                id="micIconDiv"
                className={isListening ? "mic-on" : "mic-off"}
              >
              <i className="fa-solid fa-microphone"></i>
              </div>
            )}
            {(prompt.trim().length!==0 || !speechSupported) && (
            <div id="submit" onClick={() => prompt.trim() && getReply()}>
              <i className="fa-solid fa-paper-plane"></i>
            </div>
            )}
          </div>

          <p className="info">
            EunwoGPT can make mistakes. Check important info. See Cookie
            Preferences.
          </p>
        </div>
      </div>
    </>
  );
}

export default ChatWindow;
