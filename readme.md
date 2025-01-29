# Moto Horizon - Backend

🔗 **Live API:** [Moto Horizon Server](https://pks-bike-store-server.vercel.app)

Moto Horizon's backend is built with **Express.js** and **TypeScript**, ensuring a robust and scalable API. It handles user authentication, order processing, and product management efficiently.

## 🚀 Features

- **Authentication:** Secure login & JWT-based authentication.
- **Role Management:** Admin and Customer roles.
- **Data Validation:** Uses **Zod** for input validation.
- **Database Integration:** Stores products, users, and orders using **MongoDB & Mongoose**.
- **Secure APIs:** Implements JWT for user authentication.
- **Order Processing:** Handles product orders and payment validation.

## 🛠️ Technologies Used

- **Express.js** (Backend Framework)
- **TypeScript** (Strong Typing)
- **Mongoose** (MongoDB ORM)
- **JWT (JSON Web Tokens)** (Authentication)
- **Zod** (Schema Validation)
- **Bcrypt.js** (Password Hashing)
- **Dotenv** (Environment Variables)

## 📦 Installation & Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/PallabKumarS/bike-store-server.git
   cd bike-store-server
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a **.env** file and configure the required variables:

   ```sh
   PORT=5000
   DATABASE_URL=mongodb+srv://your_database_url
   NODE_ENV=development
   BCRYPT_SALT_ROUNDS=10

   JWT_ACCESS_SECRET=your_jwt_access_secret
   JWT_ACCESS_EXPIRES_IN=1d
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   JWT_REFRESH_EXPIRES_IN=30d

   LOCAL_CLIENT=http://localhost:5173
   CLIENT=https://pks-bike-store-client.vercel.app

   SP_ENDPOINT=https://sandbox.shurjopayment.com
   SP_USERNAME=sp_sandbox
   SP_PASSWORD=pyyk97hu&6u6
   SP_PREFIX=PKS
   SP_RETURN_URL=https://pks-bike-store-client.vercel.app/verify-payment
   ```

4. Start the server:
   ```sh
   npm run dev
   ```

## 📌 API Endpoints

### Authentication Routes

| Method | Endpoint              | Description                  |
| ------ | --------------------- | ---------------------------- |
| POST   | /auth/login           | Login a user                 |
| PATCH  | /auth/change-password | Change user password         |
| POST   | /auth/refresh-token   | Refresh authentication token |

### User Routes

| Method | Endpoint                      | Description                |
| ------ | ----------------------------- | -------------------------- |
| POST   | /users/create-user            | Create a new user          |
| GET    | /users/me                     | Get current logged-in user |
| PATCH  | /users/change-status/\:userId | Change user status         |
| GET    | /users                        | Get all users (Admin only) |
| DELETE | /users/\:userId               | Delete a user (Admin only) |

### Product Routes

| Method | Endpoint              | Description                  |
| ------ | --------------------- | ---------------------------- |
| GET    | /products             | Get all products             |
| POST   | /products             | Create a new product (Admin) |
| GET    | /products/\:productId | Get a single product         |
| PATCH  | /products/\:productId | Update product (Admin)       |
| DELETE | /products/\:productId | Delete product (Admin)       |
| GET    | /products-brands      | Get all product brands       |

### Order Routes

| Method | Endpoint                    | Description                 |
| ------ | --------------------------- | --------------------------- |
| POST   | /orders                     | Create a new order          |
| GET    | /orders/revenue             | Get revenue details         |
| GET    | /orders/my-orders           | Get logged-in user's orders |
| GET    | /orders                     | Get all orders (Admin)      |
| PATCH  | /orders/\:orderId           | Update order status (Admin) |
| GET    | /orders/\:orderId           | Get a single order          |
| GET    | /verify-payment/\:paymentId | Verify payment details      |
