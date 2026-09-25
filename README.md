# Blog API Backend

A modern and secure blog backend built with Node.js, Express, and MongoDB. This project provides a complete REST API for managing users, blog posts, comments, categories, email verification, and password reset flows.

## Features

- User registration and login
- JWT-based authentication and authorization
- Email verification for new accounts
- Password reset via email
- Create, read, update, and delete blog posts
- Post likes
- Comments on posts
- Categories management
- Admin-only access controls
- Image upload support for profile pictures and posts
- MongoDB integration with Mongoose
- Input validation and error handling

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (JSON Web Tokens)
- bcryptjs
- Joi
- Multer
- Cloudinary-ready image handling
- Nodemailer
- CORS

## Project Structure

```bash
backend-blogapp/
├── app.js
├── package.json
├── .env
├── config/
│   └── connectDB.js
├── controllers/
│   ├── authController.js
│   ├── categoryController.js
│   ├── commentsController.js
│   ├── Password.js
│   ├── postsController.js
│   └── usersControllers.js
├── images/
├── middleware/
│   ├── error.js
│   ├── photoUpload.js
│   ├── validateObjectId.js
│   └── verifyToken.js
├── models/
│   ├── Category.js
│   ├── Comments.js
│   ├── Post.js
│   ├── User.js
│   └── Verificatin.js
├── routes/
│   ├── authRoute.js
│   ├── categoryRoute.js
│   ├── commentsRoute.js
│   ├── passwordRoute.js
│   ├── postsRoute.js
│   └── usersRoute.js
├── utils/
│   └── sendEmail.js
└── package-lock.json
```

## Environment Variables

Create a `.env` file in the root directory and add the following:

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
APP_EMAIL_ADDRESS=your_email@gmail.com
APP_EMAIL_PASSWORD=your_email_app_password
API_URL=http://localhost:5000
CLIENT_URL=http://localhost:3000
```

Important:
- Use a real MongoDB URI for `MONGO_URL`
- For Gmail, generate an app password if 2FA is enabled
- `CLIENT_URL` is used for password reset and account verification links

## Installation

```bash
git clone https://github.com/AliSamerShaboot19/backend-blogapp.git
cd backend-blogapp
npm install
```

## Running the App

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server runs on:

```bash
http://localhost:5000
```

## API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET /api/auth/:userId/verify/:token
```

### Users

```http
GET /api/users/profile
GET /api/users/profile/:id
PUT /api/users/profile/:id
DELETE /api/users/profile/:id
GET /api/users/count
POST /api/users/profile/profile-picture
```

### Posts

```http
GET /api/posts
POST /api/posts
GET /api/posts/count
GET /api/posts/:id
PUT /api/posts/:id
DELETE /api/posts/:id
PUT /api/posts/like/:id
```

### Comments

```http
POST /api/comments
GET /api/comments
GET /api/comments/all
PUT /api/comments/:id
DELETE /api/comments/:id
```

### Categories

```http
GET /api/categories
POST /api/categories
DELETE /api/categories/:id
```

### Password Reset

```http
POST /api/password/reset-password-link
GET /api/password/reset-password/:userId/:token
POST /api/password/reset-password/:userId/:token
```

## Authentication

Most protected routes require a JWT token in the Authorization header:

```http
Authorization: Bearer <token>
```

Admin-only actions are protected with role checks using the `isAdmin` field in the user model.

## Security

This project includes several security practices:

- Password hashing with bcryptjs
- JWT authentication
- Request validation with Joi
- Role-based authorization
- CORS enabled


## Author

Ali Samer Shaboot

