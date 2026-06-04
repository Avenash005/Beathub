# Creator's Platform

A full-stack application with end-to-end image upload integration to Cloudinary and MongoDB.

## Features

- **Real-time Notifications**: Socket.io powered instant updates
- **Image Upload**: Cloudinary integration for image storage
- **Post Creation**: Create posts with optional cover images
- **User Authentication**: JWT-based authentication
- **Dashboard**: Real-time post feed with images

## Architecture

```
Client (React + Vite)
    ↓ POST /api/upload (FormData)
Server (Express)
    ↓ Upload to Cloudinary
Cloudinary
    ↓ Returns secure_url
Client posts with coverImage → POST /api/posts
    ↓ MongoDB stores coverImage URL
Dashboard displays posts with images
```

## Tech Stack

- **Frontend**: React, Vite, Socket.io Client, react-hot-toast, axios
- **Backend**: Express, Socket.io, Mongoose, Multer
- **Database**: MongoDB (with in-memory fallback)
- **Storage**: Cloudinary

## Project Structure

```
/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── CreatePost.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── ImageUpload.jsx
│   │   └── services/      # API and Socket services
│   │       ├── api.js
│   │       └── socket.js
│   └── package.json
├── server/                 # Express backend
│   ├── models/
│   │   ├── Post.js       # Post Mongoose schema
│   │   └── User.js      # User Mongoose schema
│   ├── routes/
│   │   ├── posts.js     # Post API routes
│   │   └── upload.js   # Upload API route
│   ├── middleware/
│   │   ├── auth.js     # JWT auth middleware
│   │   └── upload.js   # Multer upload middleware
│   ├── config/
│   │   └── cloudinary.js
│   └── server.js
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (optional - uses in-memory fallback)
- Cloudinary account

### Installation

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Environment Variables

Create `server/.env`:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
MONGODB_URI=mongodb://localhost:27017/creators-platform
JWT_SECRET=your-secret-key
```

### Running the Application

```bash
# Start server (terminal 1)
cd server
npm run dev

# Start client (terminal 2)
cd client
npm run dev
```

Open http://localhost:5173 in your browser.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/upload | Upload image to Cloudinary |
| POST | /api/posts | Create new post |
| GET | /api/posts | Get all posts |
| GET | /api/health | Health check |

## WebSocket Events

- `newPost` - Emitted when a new post is created (real-time notification)

## Testing Checklist

- [ ] Post with image - full flow works
- [ ] Text-only post - works gracefully  
- [ ] Upload error - shows error message
- [ ] Large file (>5MB) - client-side validation catches it
- [ ] MongoDB stores Cloudinary URL in coverImage field
- [ ] Cloudinary Media Library shows uploaded image

## License

MIT
