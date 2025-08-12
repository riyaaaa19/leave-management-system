
# Leave Management System

A modern React.js and FastAPI based Leave Management System to manage employee leave applications, approvals, and history tracking.

---

## Features

- Employee login and registration
- Apply for leave with reason and date selection
- View leave status and history
- Admin dashboard to approve or reject leave requests
- Real-time updates and role-based access
- Bootstrap 5 based responsive UI with animations

---

## Tech Stack

- **Frontend:** React.js, React Router, Bootstrap 5
- **Backend:** FastAPI (Python)
- **Database:** SQLite (for demo purposes)
- **Authentication:** JWT Token based auth

---

## Getting Started

### Prerequisites

- Node.js and npm/yarn installed
- Python 3.8+ installed
- Git installed

### Frontend Setup

```bash
cd frontend
npm install
npm start
````

The React app will run on [http://localhost:3000](http://localhost:3000).

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The FastAPI backend will run on [http://localhost:8000](http://localhost:8000).

---

## Usage

1. Register a new user or login with existing credentials.
2. Depending on your role (admin or employee), access the respective dashboard.
3. Employees can apply for leave and track leave status.
4. Admins can view, approve, or reject leave requests.

---

## Contributing

Feel free to fork and create pull requests for any enhancements or bug fixes.

---

## License

This project is licensed under the MIT License.

---

Made with ❤️ by Riya Saraf
