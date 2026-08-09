# Fastify Thumbnail API

A REST API built with [Fastify](https://fastify.dev/) and MongoDB for managing user accounts and video thumbnails with JWT authentication and file uploads.

## Features

- JWT-based authentication (register, login, logout, forgot/reset password)
- Thumbnail CRUD with multipart file uploads
- Static file serving for uploaded thumbnails
- MongoDB via Mongoose

## Tech Stack

- Node.js
- Fastify 5
- MongoDB + Mongoose
- JWT (`@fastify/jwt`)
- bcryptjs

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB instance

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/fastify
JWT_SECRET=your_jwt_secret
```

### Run the server

```bash
npm run dev
```

The server listens on `http://localhost:3000`.

## API Endpoints

### Auth (`/api/auth`)

| Method | Endpoint                    | Description            |
| ------ | --------------------------- | ---------------------- |
| POST   | `/api/auth/register`        | Register a new user    |
| POST   | `/api/auth/login`           | Login, returns a JWT   |
| POST   | `/api/auth/forgot-password` | Request password reset |
| POST   | `/api/auth/reset-password/:token` | Reset password  |
| POST   | `/api/auth/logout`          | Logout                 |

### Thumbnails (`/api/thumbnail` - all require JWT)

| Method | Endpoint              | Description            |
| ------ | --------------------- | ---------------------- |
| POST   | `/api/thumbnail/`     | Upload a thumbnail     |
| GET    | `/api/thumbnail/`     | List user thumbnails   |
| GET    | `/api/thumbnail/:id`  | Get one thumbnail      |
| PUT    | `/api/thumbnail/:id`  | Update a thumbnail     |
| DELETE | `/api/thumbnail/:id`  | Delete one thumbnail   |
| DELETE | `/api/thumbnail/`     | Delete all thumbnails  |

### Misc

| Method | Endpoint    | Description                 |
| ------ | ----------- | --------------------------- |
| GET    | `/`         | Health check (`hello world`)|
| GET    | `/test-db`  | Check database connection   |

## Project Structure

```
├── controller/    # Route handlers
├── models/        # Mongoose models
├── plugins/       # Fastify plugins (MongoDB, JWT)
├── routes/        # Route definitions
├── uploads/       # Uploaded thumbnail files
└── server.js      # App entry point
```
