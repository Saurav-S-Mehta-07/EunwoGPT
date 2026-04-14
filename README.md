# EunwoGPT

A full-stack AI chat application built with **React + Vite**, **Express**, **MongoDB**, and **session-based authentication**.  
The app supports user login/signup, persistent chat threads, markdown-rendered responses, and a ChatGPT-like interface.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Core Features](#core-features)
4. [Architecture](#architecture)
5. [Project Structure](#project-structure)
6. [Environment Variables](#environment-variables)
7. [Local Development Setup](#local-development-setup)
8. [API Endpoints](#api-endpoints)
9. [Available Scripts](#available-scripts)
10. [Deployment Notes](#deployment-notes)
11. [Known Limitations](#known-limitations)

## Project Overview

EunwoGPT is a multi-user conversational AI app where each authenticated user can:

- create and continue chat threads
- view chat history in a sidebar
- delete old threads
- get assistant replies from an LLM backend

The frontend provides a modern chat experience (typing effect, markdown + syntax highlighting, optional speech-to-text), while the backend handles authentication, session persistence, and thread storage.

## Tech Stack

### Frontend

- React 19
- Vite 7
- React Router
- React Markdown + `rehype-highlight`
- UUID
- React Spinners
- Material UI Icons / Font Awesome

### Backend

- Node.js + Express 5
- MongoDB + Mongoose
- Passport.js (`passport-local`, `passport-local-mongoose`)
- `express-session` + `connect-mongo`
- CORS + dotenv
- Groq SDK (model call in `utils/openAi.js`)

## Core Features

- Email/password signup and login
- Session-based auth with secure cookie settings for production
- User-specific thread isolation (`thread` documents tied to `user`)
- Create/read/delete chat threads
- Persistent chat history in MongoDB
- Markdown rendering for assistant messages
- Code block syntax highlighting
- Typing animation for assistant output
- Speech input support via browser SpeechRecognition API (when available)

## Architecture

### Frontend Flow

1. Checks session via `GET /api/auth/me`
2. If authenticated, loads chat UI
3. Sends prompts to `POST /api/chat`
4. Fetches thread list/messages from thread endpoints
5. Renders messages with markdown and highlight

### Backend Flow

1. Handles auth routes under `/api/auth`
2. Protects chat/thread routes with `isLoggedIn` middleware
3. Stores thread/message data in MongoDB
4. Calls LLM provider in `Backend/utils/openAi.js`
5. Persists assistant replies into the same thread

## Project Structure

```text
EunwoGPT/
├── Backend/
│   ├── config/
│   │   └── passport.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Thread.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── chat.js
│   ├── utils/
│   │   └── openAi.js
│   ├── package.json
│   └── server.js
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── EunwoGPT.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── README.md
```

## Environment Variables

Create a `.env` file inside `Backend/`:

```env
PORT=8080
NODE_ENV=development
MONGO_ATLAS_URL=your_mongodb_connection_string
SESSION_SECRET=replace_with_a_strong_secret
GROQ_API_KEY=your_groq_api_key
```

Notes:

- `MONGO_ATLAS_URL` is used for both Mongoose and session store.
- In production, set `NODE_ENV=production` for secure cookie behavior.

## Local Development Setup

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd EunwoGPT
```

### 2. Install Dependencies

```bash
cd Backend
npm install

cd ../Frontend
npm install
```

### 3. Configure Backend Environment

- Add `Backend/.env` with the variables shown above.

### 4. Start Backend

```bash
cd Backend
npm run dev
```

Backend runs on `http://localhost:8080` by default.

### 5. Start Frontend

```bash
cd Frontend
npm run dev
```

Frontend runs on `http://localhost:5173`.

### 6. Verify API Base URL

In `Frontend/src/components/environment.js`, development currently points to:

```js
http://localhost:8080
```

## API Endpoints

Base URL: `http://localhost:8080/api`

### Auth

- `POST /auth/signup` - Register user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current session user

### Chat / Threads (Protected)

- `POST /chat` - Send message and receive assistant reply
- `GET /thread` - Get all threads for logged-in user
- `GET /thread/:threadId` - Get messages for one thread
- `DELETE /thread/:threadId` - Delete thread

## Available Scripts

### Backend (`Backend/package.json`)

- `npm run dev` - Start with nodemon
- `npm start` - Start with node

### Frontend (`Frontend/package.json`)

- `npm run dev` - Start Vite dev server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment Notes

- Configure backend CORS origin to your deployed frontend URL.
- Ensure session cookie settings align with HTTPS deployment.
- Use a managed MongoDB instance (Atlas recommended).
- Set all environment variables securely in your host platform.
- Update `Frontend/src/components/environment.js` to the deployed backend URL when needed.

## Known Limitations

- No automated test suite is currently configured.
- No token/usage controls or rate limiting are implemented yet.
- Error messaging can be improved for production observability.
- Frontend API URL is controlled by a hardcoded flag, not `.env` at the moment.
