import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/login.css";
import { loginUser, registerUser } from "../services/api";
import { login as setUserRole } from "../utilis/auth"; // import role setter

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

      localStorage.setItem("token", data.access_token);

      storeUserInfo({
        username: data.username,
        email: loginEmail,
        role: data.role,
      });

      setUserRole(data.role); // store role in localStorage

      navigate(data.role === "admin" ? "/admin" : "/employee");
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

  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      handleRegister(e);
    } else {
      handleLogin();
    }
  };

  // Reset form fields
  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="login-page">
      <div className="info-section animate-fade-in">
        <h1>🏢 Leave Management System</h1>
        <p>Manage your leaves and approvals seamlessly with our modern platform.</p>
        <ul>
          <li>📅 Apply for leave in seconds</li>
          <li>✅ Get real-time approval updates</li>
          <li>📊 Track your leave history effortlessly</li>
        </ul>
      </div>

      <div className="auth-section animate-fade-in">
        <div className="login-card">
          <h3 className="text-center mb-4 fw-bold">
            {isRegister ? "Create an Account" : "Login to Your Account"}
          </h3>

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

          <div className="text-center">
            {isRegister ? (
              <p>
                Already have an account?{" "}
                <span
                  className="toggle-link"
                  onClick={() => {
                    setIsRegister(false);
                    resetForm();
                  }}
                >
                  Login here
                </span>
              </p>
            ) : (
              <p>
                New here?{" "}
                <span
                  className="toggle-link"
                  onClick={() => {
                    setIsRegister(true);
                    resetForm();
                  }}
                >
                  Register now
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
