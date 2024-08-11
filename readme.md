# Social Media Platform Development (MERN Stack)

This project is a full-stack application for managing users, built using the MERN stack **(MongoDB, Express.js, React.js, Node.js)**. It includes user management functionalities such as user signup, login, JWT-based authentication, and various user operations. The project is structured with a React frontend and an Express backend, with testing and deployment configurations included.

## Features

- **User Signup**: Register new users with username, email, and password.
- **User Login**: Authenticate existing users and issue JWT tokens.
- **JWT Authentication**: Verify JWT tokens for secured endpoints.
- **User Operations**: Retrieve, update, deactivate, and delete user accounts.

## Project Structure

- **Frontend**: React application located in the `/client` directory.
- **Backend**: Express application located in the `/server` directory.

## Deployment

- **Frontend**: [https://ims-mern-azns.vercel.app](https://ims-mern-azns.vercel.app/)
- **Backend**: [https://ims-mern.vercel.app](https://ims-mern.vercel.app/)

## Deployment Issues
- **Slow Data Fetching**: If your facing "user not found" in home page, wait for some time as it fetching data from the database
- **Image Upload**: Image uploads may not work properly on Vercel's free hobby plan due to storage and bandwidth limitations.
- **Different Site URLs**: Make sure to handle CORS issues and configure environment variables to match your deployment URLs.


## Installation

### Frontend (React)

1. Navigate to the `client` directory:
    ```bash
    cd client
    ```

2. Install the frontend dependencies:
    ```bash
    npm install
    ```


### Backend (Express)

1. Navigate to the `server` directory:
    ```bash
    cd server
    ```

2. Install the backend dependencies:
    ```bash
    npm install
    ```

## Configuration

1. Copy the example environment file to `.env` in the `server` directory:
    ```bash
    cp .env.example .env
    ```

2. Update the `.env` file with your database connection details and other environment-specific settings.

## Running the Application

### Frontend (React)

1. Navigate to the `client` directory:
    ```bash
    cd client
    ```

2. Start the React development server:
    ```bash
    npm start
    ```


### Backend (Express)

1. Navigate to the `server` directory:
    ```bash
    cd server
    ```

2. Start the Express server:
    ```bash
    npm start
    ```
    or
    ```bash
    bun start
    ```

## Running Tests

### Backend (Express)

1. Navigate to the `server` directory:
    ```bash
    cd server
    ```

2. Run the tests:
    ```bash
    npm test
    ```


## Endpoints

- **POST** `/api/v1/user/signup` - Register a new user
- **POST** `/api/v1/user/login` - Log in an existing user
- **GET** `/api/v1/user/verify-jwt` - Verify JWT token
- **GET** `/api/v1/user/get` - Get user details by username
- **PUT** `/api/v1/user/update/:username` - Update user details
- **PATCH** `/api/v1/user/deactivate` - Deactivate user account
- **DELETE** `/api/v1/user/delete` - Delete user account

