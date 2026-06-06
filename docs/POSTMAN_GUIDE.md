# Postman Collection Guide

## Overview

This guide provides instructions for setting up and using the Postman collection to test the Creator's Platform API. The collection includes endpoints for health checking, authentication (register/login), and posts CRUD operations.

## Prerequisites

- Postman desktop app installed (download from [postman.com](https://www.postman.com/downloads))
- Node.js server running on localhost:5000

## Setup

### Step 1: Import the Collection

1. Open Postman
2. Click "Import" in the top left corner
3. Select "File" and choose `docs/Creator-Platform-API.postman_collection.json`
4. Click "Import" to add the collection to your workspace

### Step 2: Import the Environment

1. Click "Environments" in the left sidebar
2. Click "Import" in the top right corner
3. Select "File" and choose `docs/Local-Development.postman_environment.json`
4. Click "Import" to add the environment

### Step 3: Select the Environment

In the top right corner of Postman, click the environment dropdown and select "Local Development".

### Step 4: Start the Server

```bash
cd server
npm start
```

The server should be running on http://localhost:5000

## Collection Structure

```
Creator's Platform API
├── Health
│   └── Health Check
├── Auth
│   ├── Register User
│   └── Login User
└── Posts
    ├── Get All Posts
    ├── Create Post
    ├── Update Post
    └── Delete Post
```

## Usage

### Running Requests

1. Expand the collection in the left sidebar
2. Double-click a request to open it
3. Click "Send" to execute the request
4. View the response in the bottom panel

### Recommended Order

1. **Health Check** - Verify the server is running
2. **Register User** - Create a test account (token is auto-saved)
3. **Login User** - Get a fresh token (token is auto-saved)
4. **Create Post** - Create a new post
5. **Get All Posts** - View all posts
6. **Update Post** - Update an existing post
7. **Delete Post** - Delete a post

## Environment Variables

| Variable | Description |
|----------|-------------|
| `baseURL` | Server URL (default: http://localhost:5000) |
| `authToken` | JWT token (auto-populated on register/login) |

## Test Assertions

The collection includes automated tests in the "Tests" tab of each request. After sending a request, check the "Test Results" section in the response panel to see which tests passed or failed.

### Examples

- **Health Check**: Verifies status code 200 and response has "status: ok"
- **Register User**: Verifies status code 201, response has token and user object
- **Login User**: Verifies status code 200, response has token, and auto-saves token to environment
- **Get All Posts**: Verifies status code 200 and response is an array
- **Create Post**: Verifies status code 201 and response has title/content

## Common Issues

### Issue: "Could not get any response"

**Cause**: Server isn't running, or Postman can't reach localhost.

**Fix**:
1. Start your server: `npm start` in the server directory
2. Check the URL and port (default: 5000)
3. Disable VPN or firewall temporarily
4. Try accessing http://localhost:5000/api/health in your browser

### Issue: "Unauthorized" or 401 response

**Cause**: Token is missing, expired, or malformed.

**Fix**:
1. Run the Login User request again to get a fresh token
2. Check that the authToken variable is populated in your environment
3. Verify the Authorization header is set: Bearer {{authToken}}
4. Make sure the correct environment is selected

### Issue: Environment variables not working

**Cause**: Environment isn't active.

**Fix**:
1. Check the top-right dropdown — it should show "Local Development"
2. If it says "No Environment", select your environment
3. verify variables are set in the environment settings

### Issue: Tests failing unexpectedly

**Cause**: Response structure doesn't match expectations.

**Fix**:
1. Check the actual response in the Body tab
2. Update your test assertions to match the real response format
3. Look at the console output in Postman for debugging info

## API Endpoints Reference

### Health Check
- **Method**: GET
- **URL**: `/api/health`
- **Response**: `{ status: "ok", message: "Server is running" }`

### Register User
- **Method**: POST
- **URL**: `/api/auth/register`
- **Body**: `{ name, email, password }`
- **Response**: `{ success: true, token, user: { id, name, email } }`
- **Status**: 201 Created

### Login User
- **Method**: POST
- **URL**: `/api/auth/login`
- **Body**: `{ email, password }`
- **Response**: `{ success: true, token }`
- **Status**: 200 OK

### Get All Posts
- **Method**: GET
- **URL**: `/api/posts`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Array of post objects

### Create Post
- **Method**: POST
- **URL**: `/api/posts`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ title, content, author? }`
- **Response**: Created post object
- **Status**: 201 Created

### Update Post
- **Method**: PUT
- **URL**: `/api/posts/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ title?, content? }`
- **Response**: Updated post object

### Delete Post
- **Method**: DELETE
- **URL**: `/api/posts/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Success message

## Video Tutorial

A 3-5 minute video demonstration is available that covers:
1. Collection overview and folder structure
2. Environment and variables setup
3. Running requests with test assertions
4. Export and documentation purposes

## Additional Resources

- [Postman Learning Center](https://learning.postman.com/)
- [Postman Writing Tests](https://learning.postman.com/docs/writing-scripts/test-scripts)
- [Postman Variables](https://learning.postman.com/docs/sending-requests/variables)

---

For issues or questions, please refer to the main project README or open an issue on GitHub.
