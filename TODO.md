# Real-Time Notification System Implementation Plan

## Phase 1: Backend Implementation

### 1.1 Install Dependencies
- [x] Install `jsonwebtoken` in server directory
- [x] Install `mongoose` for MongoDB (optional, using in-memory for now)

### 1.2 Create Post Routes
- [x] Create `server/routes/posts.js` with POST endpoint
- [x] Implement in-memory posts storage
- [x] Export function to accept `io` as parameter

### 1.3 Update Server.js
- [x] Add JWT_SECRET constant
- [x] Add Socket.io authentication middleware using `io.use()`
- [x] Extract JWT from `socket.handshake.auth.token`
- [x] Verify JWT using `jwt.verify()`
- [x] Store decoded user in `socket.data.user`
- [x] Log authenticated user's email on connection
- [x] Use next() to allow, next(new Error()) to reject

---

## Phase 2: Frontend Implementation

### 2.1 Install Dependencies
- [x] Install `react-hot-toast` in client directory

### 2.2 Update Socket Service
- [x] Read JWT from localStorage (key: "token")
- [x] Pass JWT in `auth` option when creating socket

### 2.3 Update App.jsx
- [x] Import `Toaster` from react-hot-toast
- [x] Add `<Toaster />` component to the app

### 2.4 Update Dashboard.jsx
- [x] Add listener for 'newPost' event
- [x] Display toast.success() when event received
- [x] Clean up 'newPost' listener in useEffect cleanup

---

## Phase 3: Testing

### 3.1 Verify Functionality
- [x] Server is running and working
- [x] POST /api/posts creates post and emits newPost event
- [x] GET /api/posts returns all posts
- [x] Cloudinary .env created with credentials
- [x] Cloudinary .env.example created with placeholders
- [x] .env is protected in .gitignore

---

## Files Modified:
1. `server/package.json` - Added jsonwebtoken - DONE
2. `server/server.js` - Added JWT middleware, posts route, emit event - DONE
3. `server/routes/posts.js` - Created new file - DONE
4. `client/package.json` - Added react-hot-toast - DONE
5. `client/src/services/socket.js` - Added JWT in auth option - DONE
6. `client/src/App.jsx` - Added Toaster component - DONE
7. `client/src/components/Dashboard.jsx` - Added newPost listener + toast - DONE

---

## Expected Flow:
1. User logs in → JWT stored in localStorage
2. React connects to Socket.io with JWT in auth
3. Server verifies JWT via middleware
4. User creates post → POST /api/posts
5. Backend saves post → emits 'newPost' event to all clients
6. All connected clients receive toast notification
