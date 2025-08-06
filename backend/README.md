# Talky Backend - Google Authentication

This backend provides Google OAuth authentication for the Talky chat application.

## Features

- Google OAuth authentication
- JWT token generation and verification
- MongoDB user management
- Protected routes middleware

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:5173

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/talky
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/talky

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
```

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set application type to "Web application"
6. Add authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - Your production domain
7. Copy the Client ID and add it to your `.env` file

### 4. MongoDB Setup

#### Local MongoDB:

```bash
# Install MongoDB locally or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### MongoDB Atlas:

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace `MONGODB_URI` in `.env`

### 5. Run the Server

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### POST `/api/auth/google`

Google OAuth authentication endpoint.

**Request Body:**

```json
{
  "token": "google-id-token"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Authentication successful",
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "picture": "profile-picture-url",
    "isEmailVerified": true
  }
}
```

### GET `/api/auth/verify`

Verify JWT token and get user data.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "picture": "profile-picture-url",
    "isEmailVerified": true
  }
}
```

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── middleware/
│   └── auth.js              # Authentication middleware
├── models/
│   └── User.js              # User model
├── routes/
│   └── auth.js              # Authentication routes
├── utils/
│   └── generateToken.js     # JWT token generation
├── server.js                # Main server file
└── package.json
```

## Security Features

- JWT token authentication
- CORS protection
- Helmet security headers
- Input validation
- Error handling
- Rate limiting (can be added)

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## Development

- Server runs on `http://localhost:5001`
- MongoDB connection is established on startup
- Hot reload with nodemon in development
- Detailed logging with morgan
