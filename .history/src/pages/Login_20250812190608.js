import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/login.css";
import { loginUser, registerUser } from "../services/api";

// Save user info in localStorage
function storeUserInfo(userObj) {
  localStorage.setItem("loggedInUser", JSON.stringify(userObj));
}

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Handle login
  const handleLogin = async (loginEmail = email, loginPassword = password) => {
    try {
      const data = await loginUser({ email: loginEmail, password: loginPassword });

      console.log("Login response user role:", data.user.role); // Debug

      localStorage.setItem("token", data.access_token);

      storeUserInfo({
        username: data.user.username,
        email: loginEmail,
        role: data.user.role,
      });

      // Navigate based on user role from data.user.role
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/employee");
      }
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("loggedInUser");
      alert(error.message || "Login failed");
    }
  };

  // Handle register then login
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser({ username, email, password });
      await handleLogin(email, password);
    } catch (error) {
      alert(error.message || "Registration failed");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      handleRegister(e);
    } else {
      handleLogin();
    }
  };

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="login-page">
      {/* ... your existing JSX code unchanged ... */}
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div className="mb-3">
            <label htmlFor="usernameInput">Username</label>
            <input
              type="text"
              id="usernameInput"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              autoComplete="username"
            />
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="emailInput">Email</label>
          <input
            type="email"
            id="emailInput"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
            autoComplete="email"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="passwordInput">Password</label>
          <input
            type="password"
            id="passwordInput"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
            autoComplete={isRegister ? "new-password" : "current-password"}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100 mb-3">
          {isRegister ? "Register" : "Login"}
        </button>
      </form>
      {/* ...rest unchanged */}
    </div>
  );
}

export default Login;
