# InterviewAI

InterviewAI is a full-stack MERN application for managing interview assessments, user attempts, scoring, dashboards, and admin workflows. It supports authentication, protected routes, assessment creation and publishing, per-user attempts, and result tracking.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Authentication: JWT + bcryptjs
- HTTP Client: Axios

## Features

- User registration and login
- JWT-based authentication and protected routes
- Profile management and password changes
- Admin-only question and assessment management
- Assessment publishing and unpublishing
- User assessment attempts with timer support
- Answer saving and final submission flow
- Auto-scoring and result breakdown
- Attempt history and dashboard analytics
- Admin management views for attempts and metrics

## Project Structure

```text
backend/
  app.js
  server.js
  config/
  controllers/
  middlewares/
  models/
  routes/
  services/
  utils/
  validators/
  .env.example

frontend/
  index.html
  package.json
  vite.config.js
  src/
  .env.example
```

## Environment Setup

Create your local environment files based on the examples:

1. Copy `backend/.env.example` to `backend/.env`
2. Copy `frontend/.env.example` to `frontend/.env`

### Backend `.env`

Use your own local values for the environment variables below. Do not commit real secrets or production credentials.

```env
PORT=your_backend_port
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_secure_random_string
NODE_ENV=development
CLIENT_URL=your_frontend_origin
```

### Frontend `.env`

```env
VITE_API_URL=your_backend_api_base_url
```

## Run Locally

### 1) Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2) Start MongoDB

Make sure MongoDB is running locally on the URI specified in `backend/.env`.

### 3) Run the backend

```bash
cd backend
npm run dev
```

### 4) Run the frontend

```bash
cd frontend
npm run dev
```

Start both servers with your local environment variables configured. The exact local URLs depend on your chosen frontend and backend ports.

## Production Build

```bash
cd frontend
npm run build
```

This creates a production bundle in the `frontend/dist` folder.

## API Overview

The backend exposes its application routes under the configured `/api` prefix. Common sections include authentication, user management, assessments, question management, and admin dashboards.

- Auth routes handle login, registration, and session information
- User routes manage profile and account actions
- Question routes support question listing and admin management
- Assessment routes cover browsing, attempts, submissions, and result retrieval
- Dashboard routes provide user and admin analytics
- Health routes expose service availability checks

## Security Notes

- JWT tokens are stored in the browser and sent with API requests
- Protected routes enforce authentication and role authorization
- CORS is restricted to configured frontend origins
- Sensitive credentials are kept in local environment files and never committed to the repository
- Real environment variables are ignored by Git while example files remain tracked

## Notes

This project is intentionally kept as a standard MERN interview application and does not include AI-powered features, AI-generated questions, AI mock interviews, or external AI evaluation flows.

## License

This project is for educational and portfolio use.
