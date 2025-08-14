# 🗓️ Leave Management System

A modern React.js and FastAPI based Leave Management System to manage employee leave applications, approvals, and history tracking.

## ✨ Features

* 👤 Employee login and registration
* 📝 Apply for leave with reason and date selection
* 📊 View leave status and history
* 🛠️ Admin dashboard to approve or reject leave requests
* ⚡ Real-time updates and role-based access
* 🎨 Bootstrap 5 based responsive UI with animations

## 🛠️ Tech Stack

* **Frontend:** React.js, React Router, Bootstrap 5
* **Backend:** FastAPI (Python)
* **Database:** SQLite(local testing and development) and PostgreSQL(deployment on Render and production environments)
* **Authentication:** 🔐 JWT Token based auth

## 🚀 Getting Started

### Prerequisites

* Node.js and npm/yarn installed
* Python 3.8+ installed
* Git installed

### Frontend Setup

```bash
npm install
npm start
```

The React app will run on [http://localhost:3000](http://localhost:3000).

### Backend Setup

```bash
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

The FastAPI backend will run on [http://localhost:8000](http://localhost:8000).

## 📝 Admin Login Instructions

To create and login as an admin:

1. Run the script to create an admin user:

```bash
python create_admin.py
```

2. Use the following credentials to login:

   * **Email:** `admin@example.com`
   * **Password:** `Admin@123`
   * **Username:** `admin` (you won’t be prompted for this, but it’s stored in the backend)
3. Once logged in, you can access the **Admin Dashboard** to approve or reject leave requests.

## 🎯 Usage

* 🔑 Register a new user or login with existing credentials.
* 🧑‍💼 Depending on your role (admin or employee), access the respective dashboard.
* 📝 Employees can apply for leave and track leave status.
* ✅ Admins can view, approve, or reject leave requests.

## 🤝 Contributing

Feel free to fork and create pull requests for any enhancements or bug fixes.

## 📄 License

This project is licensed under the MIT License.

Made with ❤️ by **Riya Saraf**
