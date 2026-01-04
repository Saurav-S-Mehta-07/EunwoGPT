import React, { useContext, useState } from "react";
import { BeatLoader } from "react-spinners";

import "./LogSign.css";
import { MyContext } from "./MyContext";
// import video from "../assets/initialBg.mp4";
import { v1 as uuidv1 } from "uuid";
import server from './environment.js';

function LogSign() {
  const {
    isLoggedIn,
    setPrompt,
    setCurrThreadId,
    setIsLoggedIn,
    setIsUser,
    setPrevChats,
    setNewChat,
    setReply,
    setIsDropDownOpen,
    logoutMsg
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);

  const [showLogIn, setShowLogIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginValidated, setLoginValidated] = useState(false);

  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupValidated, setSignupValidated] = useState(false);

  const showLoginPage = () => {
    setShowLogIn(true);
    setShowSignUp(false);
  };

  const showSignUpPage = () => {
    setShowSignUp(true);
    setShowLogIn(false);
  };

  const createNewChat = () => {
    setIsDropDownOpen(false);
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginValidated(true);
    setLoginError("");

    if (!loginEmail || !loginPassword) return;

    if (!isValidEmail(loginEmail)) {
      setLoginError("Please enter a valid email address");
      return;
    }

    try {
       setLoading(true);
      const res = await fetch(`${server}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.error || "Invalid email or password");
        setLoading(false);
        return;
      }
      setIsUser(true);
      createNewChat();
      setIsLoggedIn(true);
    } catch {
      setLoginError("Server error");
    }
    finally{
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupValidated(true);
    setSignupError("");
    if (!signupUsername || !signupEmail || !signupPassword) return;

    if (!isValidEmail(signupEmail)) {
      setSignupError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${server}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: signupUsername,
          email: signupEmail,
          password: signupPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSignupError(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      setIsUser(true);
      createNewChat();
      setLoading(false);
      setIsLoggedIn(true);
    } catch {
      setSignupError("Server error");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="videoDivInLogInPage">
        {/* <video autoPlay muted loop playsInline className="video">
          <source src={video} type="video/mp4" />
        </video> */}
      </div>

      {!isLoggedIn && (
        <div className="LogSign">
          {logoutMsg && <p style={{color:"rgba(44, 25, 214, 1)"}}>{logoutMsg}</p>}
          <h1>Welcome to EunwoGPT</h1>
          <button className="loginBtn" onClick={showLoginPage}>Login</button>
          <button className="signupBtn" onClick={showSignUpPage}>Signup</button>
          <p>login / signup to use EunwoGPT</p>
        </div>
      )}

      {showLogIn && (
        <form className="loginPage" noValidate onSubmit={handleLogin}>
          <BeatLoader color="white" loading={loading} />
          {loginError && <p style={{ color: "rgb(190, 52, 52)" }}>{loginError}</p>}

          <input
            type="email"
            placeholder="Enter email"
            className="input form-control"
            value={loginEmail}
            onChange={(e) => {
              setLoginEmail(e.target.value);
              setLoginError("");
            }}
          />
          {loginValidated && !loginEmail && (
            <div className="invalid-feedback d-block">Email is required</div>
          )}

          <input
            type="password"
            placeholder="Enter password"
            className="input form-control"
            value={loginPassword}
            onChange={(e) => {
              setLoginPassword(e.target.value);
              setLoginError("");
            }}
          />
          {loginValidated && !loginPassword && (
            <div className="invalid-feedback d-block">Password is required</div>
          )}

          <button type="submit">Login</button>

          <p>
            Don't have an account?{" "}
            <span onClick={showSignUpPage} style={{ cursor: "pointer", color: "blue" }}>
              Register here
            </span>
          </p>
        </form>
      )}

      {showSignUp && (
        
        <form className="signupPage" noValidate onSubmit={handleSignup}>
          <BeatLoader color="white" loading={loading} />
            
          {signupError && <p style={{ color: "red" }}>{signupError}</p>}

          <input
            type="text"
            placeholder="Enter username"
            className="input form-control"
            value={signupUsername}
            onChange={(e) => {
              setSignupUsername(e.target.value);
              setSignupError("");
            }}
          />
          {signupValidated && !signupUsername && (
            <div className="invalid-feedback d-block">Username is required</div>
          )}

          <input
            type="email"
            placeholder="Enter email"
            className="input form-control"
            value={signupEmail}
            onChange={(e) => {
              setSignupEmail(e.target.value);
              setSignupError("");
            }}
          />
          {signupValidated && !signupEmail && (
            <div className="invalid-feedback d-block">Email is required</div>
          )}

          <input
            type="password"
            placeholder="Enter password"
            className="input form-control"
            value={signupPassword}
            onChange={(e) => {
              setSignupPassword(e.target.value);
              setSignupError("");
            }}
          />
          {signupValidated && !signupPassword && (
            <div className="invalid-feedback d-block">Password is required</div>
          )}

          <button type="submit">Sign Up</button>

          <p>
            Already have an account?{" "}
            <span onClick={showLoginPage} style={{ cursor: "pointer", color: "blue" }}>
              Login here
            </span>
          </p>
        </form>
      )}
    </>
  );
}

export default LogSign;
