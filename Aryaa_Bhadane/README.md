# Library Management System REST API

A production-ready RESTful API for a Library Management System built with **Node.js**, **Express.js**, **JWT authentication**, **bcrypt password hashing**, and **Firebase Firestore** as the database.

---

## 🚀 Features

- **JWT Authentication & Authorization**: Secure User Registration & Login with Role-Based Access Control (RBAC: `student` & `librarian`).
- **Book Management**: Full CRUD operations for librarians; filtered search (category, status, author) and keyword search for all users.
- **Borrow & Return System**: Students can borrow books with automated 14-day due date calculation and inventory status management.
- **Transaction History**: Track active, returned, and overdue borrowing transactions.
- **User Management**: Librarians can list, view, change roles, or delete user accounts.
- **Security & Reliability**:
  - `helmet` for HTTP header security.
  - `express-rate-limit` for rate limiting (100 requests per 15 minutes per IP).
  - `cors` enabled for cross-origin resource sharing.
  - Centralized error handling with consistent JSON responses.
  - `express-validator` for strict payload validation.
- **API Documentation**: Interactive Swagger OpenAPI 3.0 documentation served at `/api-docs`.

---

## 📁 Directory Structure

```
Aryaa_Bhadane/
├── server.js
├── package.json
├── .gitignore
├── .env
├── .env.example
├── render.yaml
├── README.md
├── docs/
│   └── swagger.yaml
└── src/
    ├── config/
    │   ├── firebase.js
    │   └── swagger.js
    ├── controllers/
    │   ├── authController.js
    │   ├── bookController.js
    │   ├── transactionController.js
    │   └── userController.js
    ├── middleware/
    │   ├── auth.js
    │   ├── role.js
    │   ├── logger.js
    │   ├── rateLimiter.js
    │   └── validator.js
    ├── models/
    │   ├── userModel.js
    │   ├── bookModel.js
    │   └── transactionModel.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── bookRoutes.js
    │   ├── transactionRoutes.js
    │   └── userRoutes.js
    └── utils/
        ├── jwt.js
        └── validation.js
```

---

## 🛠️ Prerequisites & Installation

### 1. Clone the Repository & Install Dependencies
```bash
cd Desktop/assignment-6-library-management-api/Aryaa_Bhadane
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` with your actual Firebase service account details and JWT secret:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

---

## 🔥 Firebase Firestore Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new Firebase project (or select an existing one).
3. Under **Build**, select **Firestore Database** and click **Create Database** (start in Production or Test mode).
4. Navigate to **Project Settings** (gear icon) > **Service accounts**.
5. Click **Generate new private key** and download the JSON key file.
6. Copy the following values from the downloaded JSON file into your `.env` file:
   - `project_id` -> `FIREBASE_PROJECT_ID`
   - `client_email` -> `FIREBASE_CLIENT_EMAIL`
   - `private_key` -> `FIREBASE_PRIVATE_KEY` *(Ensure newlines `\n` in the key string are preserved).*

> [!WARNING]
> Never commit your Firebase service account JSON file or `.env` file to Git. Both are excluded via `.gitignore`.

---

## 🏃 Running the Application

### Development Mode (with nodemon):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

Once running, access the interactive Swagger documentation at:  
👉 **`http://localhost:5000/api-docs`**

---

## 📌 API Endpoint Summary

### Auth Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user (`student` or `librarian`) |
| `POST` | `/api/auth/login` | Public | Login and receive JWT token |
| `GET` | `/api/auth/profile` | Protected | Get logged in user details |
| `PUT` | `/api/auth/profile` | Protected | Update own profile details |

### Book Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/books` | Public | List all books (supports query params: `category`, `status`, `author`) |
| `GET` | `/api/books/search` | Public | Search books by title or author (`?q=term`) |
| `GET` | `/api/books/:id` | Public | Get single book details |
| `POST` | `/api/books` | Librarian | Add a new book |
| `PUT` | `/api/books/:id` | Librarian | Update a book |
| `DELETE` | `/api/books/:id` | Librarian | Delete a book |

### Borrow & Return Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/books/:id/borrow` | Student | Borrow a book (sets 14-day due date, decrements quantity) |
| `POST` | `/api/books/:id/return` | Student | Return a borrowed book (increments quantity, completes tx) |
| `GET` | `/api/transactions` | Librarian | List all transactions in system |
| `GET` | `/api/transactions/my` | Authenticated | View own transaction history |

### User Management Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users` | Librarian | List all registered users |
| `GET` | `/api/users/:id` | Librarian | Get user details by ID |
| `PUT` | `/api/users/:id/role` | Librarian | Update user role (`student` or `librarian`) |
| `DELETE` | `/api/users/:id` | Librarian | Delete user account |

---

## 🌐 Deploying to Render

Follow these step-by-step instructions to deploy this REST API to **Render**:

### Step 1: Push Code to GitHub
1. Initialize git and commit your files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Library Management System API"
   ```
2. Create a new repository on GitHub (e.g. `library-management-api`).
3. Connect your local repository and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/library-management-api.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Create Web Service on Render
1. Log into your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** > **Web Service**.
3. Connect your GitHub account and select the **`library-management-api`** repository.
4. Configure the Web Service settings:
   - **Name**: `library-management-api` (or custom name)
   - **Region**: Select closest region
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### Step 3: Add Environment Variables on Render
Under the **Environment** section of your new Web Service on Render, add the following key-value pairs:

| Environment Variable | Value Example |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `your_production_jwt_secret_key` |
| `JWT_EXPIRES_IN` | `7d` |
| `FIREBASE_PROJECT_ID` | `your_firebase_project_id` |
| `FIREBASE_CLIENT_EMAIL` | `your_service_account_client_email` |
| `FIREBASE_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n` |

### Step 4: Deploy & Verify
1. Click **Create Web Service**.
2. Wait for the build and deployment logs to finish.
3. Open your live service URL (e.g., `https://library-management-api.onrender.com/api-docs`) to verify Swagger documentation is live!

DEPLOYMENT LINK: https://assignment-6-library-management-api-1.onrender.com/
