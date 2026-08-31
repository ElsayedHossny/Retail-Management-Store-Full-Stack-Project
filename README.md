# 🏪 Store Management System

A **Full-Stack Store Management System** designed to help manage and organize the main operations of a store through a centralized system.

The project provides management for **Products, Suppliers, Sales, and Users**, along with a dashboard for monitoring store activities and statistics.

---

## 📌 About The Project

This project was developed as part of my **Full-Stack development journey**.

The main goal was to build a practical store management system while applying concepts such as:

* RESTful API development
* Database design and relationships
* CRUD operations
* Data validation
* Authentication & authorization
* Backend architecture
* Connecting Frontend and Backend

The project focuses mainly on the **Backend**, including API development, business logic, database operations, and validation.

---

## ✨ Features

### 📦 Products Management

* Add new products
* View products
* Update product information
* Delete products
* Manage product data

### 👥 Suppliers Management

* Add suppliers
* View suppliers
* Update supplier information
* Delete suppliers
* Manage supplier relationships

### 💰 Sales Management

* Create sales
* Track sold products
* Manage sales records
* Connect sales with products and users

### 👤 User Management

* User registration
* User management
* Input validation
* Authentication and authorization

### 📊 Dashboard

* Overview of store data
* Sales statistics
* Products information
* Suppliers information
* Store activity monitoring

### 🔄 RESTful APIs

The application provides RESTful API endpoints for managing the different resources in the system.

---

## 🛠️ Technologies Used

### Backend

* Node.js
* Express.js
* JavaScript
* REST APIs

### Database

* MySQL
* SQL
* Relational Database Design

### Tools

* Git
* GitHub
* Postman
* VS Code

---

## 🗄️ Database Structure

The system uses a relational database to connect the main entities of the store.

Main entities include:

* **Users**
* **Products**
* **Suppliers**
* **Sales**

The database relationships are designed to maintain data consistency and represent the real-world relationships between store operations.

---

## 🔗 API Endpoints

The project includes CRUD endpoints for the main resources.

### Products

| Method | Endpoint            | Description       |
| ------ | ------------------- | ----------------- |
| GET    | `/api/products`     | Get all products  |
| GET    | `/api/products/:id` | Get product by ID |
| POST   | `/api/products`     | Create a product  |
| PUT    | `/api/products/:id` | Update a product  |
| DELETE | `/api/products/:id` | Delete a product  |

### Suppliers

| Method | Endpoint             | Description        |
| ------ | -------------------- | ------------------ |
| GET    | `/api/suppliers`     | Get all suppliers  |
| GET    | `/api/suppliers/:id` | Get supplier by ID |
| POST   | `/api/suppliers`     | Create a supplier  |
| PUT    | `/api/suppliers/:id` | Update a supplier  |
| DELETE | `/api/suppliers/:id` | Delete a supplier  |

### Sales

| Method | Endpoint         | Description    |
| ------ | ---------------- | -------------- |
| GET    | `/api/sales`     | Get all sales  |
| GET    | `/api/sales/:id` | Get sale by ID |
| POST   | `/api/sales`     | Create a sale  |
| PUT    | `/api/sales/:id` | Update a sale  |
| DELETE | `/api/sales/:id` | Delete a sale  |

> **Note:** Update the endpoint names above if your actual API routes are different.

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/store-management-system.git
```

### 2. Navigate to the project

```bash
cd store-management-system
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the root directory and add your environment variables:

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=store_management
```

### 5. Setup the database

Create the MySQL database and import the provided SQL script if available.

### 6. Start the application

For development:

```bash
npm run dev
```

Or:

```bash
npm start
```

---

## 🧪 API Testing

The APIs were tested using **Postman** to verify:

* Request and response handling
* CRUD operations
* Validation
* Error handling
* Database operations
* API functionality

---

## 📂 Project Structure

```text
Store-Management-System/
│
├── controllers/
├── models/
├── routes/
├── middleware/
├── config/
├── database/
├── app.js
├── server.js
├── package.json
├── .env.example
└── README.md
```

> The structure may vary depending on the final project implementation.

---

## 🎯 Learning Outcomes

Through this project, I gained practical experience in:

* Building RESTful APIs
* Working with Node.js and Express.js
* Designing relational databases
* Working with MySQL
* Implementing CRUD operations
* Handling validation and errors
* Connecting APIs with databases
* Testing APIs using Postman
* Understanding Backend architecture
* Working as part of a development team

---

## 🤝 Team & Acknowledgments

A special thanks to my instructors **Amira Ezaat** and **Rana Mostafa** for their continuous guidance and support throughout this learning journey.

Also, a big thanks to my teammates **[Name 1]** and **[Name 2]** for their collaboration, effort, and support throughout the project.

Special thanks to **Route Academy** for being an important part of this learning journey. ❤️

---

## 🚀 Future Improvements

Some potential improvements for future versions:

* Advanced authentication and authorization
* Role-based access control
* Advanced sales reports
* Product search and filtering
* Pagination
* Improved dashboard analytics
* Deployment to a production environment

---

## 👨‍💻 Author

**Elsayed Hossny**

Software Engineer | Front-End Developer

Currently open to **Front-End opportunities**.

---

⭐ If you find this project useful, feel free to give it a star!
