# SafetyApp Backend

This repository contains the backend code for the SafetyApp, a full-stack MERN project. The backend is built using Node.js, Express, and MongoDB, and it includes integration with OpenAI for enhanced functionalities.

## Technology Stack

- **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express:** A minimal and flexible Node.js web application framework.
- **MongoDB:** A NoSQL database for modern applications.
- **Mongoose:** An Object Data Modeling (ODM) library for MongoDB and Node.js.
- **JWT (JSON Web Tokens):** For securing routes and authentication.
- **Bcryptjs:** A library for hashing and securing user passwords.
- **Multer:** A middleware for handling `multipart/form-data`, primarily used for uploading files.
- **Nodemailer:** A module for Node.js applications to allow email sending.
- **OpenAI:** Integration for AI functionalities.
- **Other dependencies:** `cors`, `dotenv`, etc.

## API Routes

The backend provides various API routes for user and application data management. All routes are secured with JWT authentication.

### User Routes

- **POST /users:** Create a new user.
- **POST /users/login:** Handle user login.
- **GET /users/s/me:** Retrieve the currently authenticated user. *(Protected)*
- **GET /users:** Retrieve all users. *(Protected)*
- **GET /users/:id:** Retrieve a specific user by ID. *(Protected)*
- **PUT /users:** Update a specific user by ID. *(Protected)*
- **DELETE /users/:id:** Delete a specific user by ID. *(Protected)*

### Utility Routes

- **POST /users/image:** Upload an image and send it via email. *(Protected)*
- **POST /users/ai:** Trigger OpenAI prompt. *(Protected)*

## Running the Backend

To run the backend locally, follow these steps:

- Clone the repository.
- Install dependencies using `npm install`.
- Start the server in development mode using `npm run dev`.

## Contributing

Your contributions to improve the backend or add new features are highly welcome. Please refer to the [issues page](link-to-your-backend-issues-page) for ways to contribute.

## Author

### [Liron Sifado](https://github.com/LironSif)


