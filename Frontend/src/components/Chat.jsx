import React, { useContext, useState, useEffect, useRef } from "react";
import "./Chat.css";
import { MyContext } from "./MyContext";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);

  const [latestReply, setLatestReply] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const chatRef = useRef(null);

  const autoScrollAllowedRef = useRef(true);
  const lastScrollTopRef = useRef(0);

  //typing effect
  useEffect(() => {
    if (!reply) {
      setLatestReply(null);
      setIsPrinting(false);
      return;
    }

    // new reply allow autoscroll
    autoScrollAllowedRef.current = true;

    const words = reply.split(/(\s+)/);
    let idx = 0;
    setIsPrinting(true);

    const interval = setInterval(() => {
      setLatestReply(words.slice(0, idx + 1).join(""));
      idx++;

      if (idx >= words.length) {
        clearInterval(interval);
        setIsPrinting(false);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [reply]);

  //scroll direction logic

  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;

    const onScroll = () => {
      const threshold = 20;
      const scrollTop = el.scrollTop;
      const atBottom =
        el.scrollHeight - scrollTop - el.clientHeight < threshold;

      const scrollingDown = scrollTop > lastScrollTopRef.current;

      // user scrolls up lock autoscroll
      if (!scrollingDown) {
        autoScrollAllowedRef.current = false;
      }

      // user scrolls DOWN at bottom while printing unlock
      if (scrollingDown && atBottom && isPrinting) {
        autoScrollAllowedRef.current = true;
      }

      lastScrollTopRef.current = scrollTop;
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [isPrinting]);

  //auto scroll
  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;

    if (isPrinting && autoScrollAllowedRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [latestReply, isPrinting]);

  useEffect(() => {
  const el = chatRef.current;
  if (!el) return;

  // scroll to bottom whenever prevChats change (thread loaded)
  el.scrollTop = el.scrollHeight;
}, [prevChats]);

  return (
    <>
      {newChat && <h1 className="fs-3 startNewChat">Start a New Chat!</h1>}

      {prevChats.length !== 0 && (
        <div className="chats" ref={chatRef}>
          {prevChats.slice(0, -1).map((chat, idx) => (
            <div
              key={idx}
              className={chat.role === "user" ? "userDiv" : "gptDiv"}
            >
              {chat.role === "user" ? (
                <p className="userMessage">{chat.content}</p>
              ) : (
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {chat.content}
                </ReactMarkdown>
              )}
            </div>
          ))}

          {latestReply !== null ? (
            <div className="gptDiv">
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {latestReply}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="gptDiv">
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {prevChats[prevChats.length - 1]?.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Chat;
