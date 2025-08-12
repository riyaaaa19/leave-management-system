import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // On mount, check if user is logged in; if not, redirect to login
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedUser) {
      navigate("/login", { replace: true });
    } else {
      setUser(loggedUser);
    }
  }, [navigate]);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      const dropdown = document.getElementById("profile-dropdown-menu");
      const avatar = document.getElementById("profile-avatar");
      if (
        dropdown &&
        !dropdown.contains(event.target) &&
        avatar &&
        !avatar.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const displayName = user.username || user.name || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{
        background:
          "linear-gradient(90deg, rgba(58,123,213,1) 0%, rgba(0,210,255,1) 100%)",
        padding: "10px 30px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <span
        className="navbar-brand fw-bold"
        style={{ fontSize: "1.8rem", letterSpacing: "1.2px" }}
      >
        Leave Management
      </span>

      <div
        id="profile-avatar"
        onClick={() => setShowDropdown((prev) => !prev)}
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          cursor: "pointer",
          position: "relative",
        }}
        title={displayName}
      >
        <div
          style={{
            backgroundColor: "#fff",
            color: "#3a7bd5",
            fontWeight: "700",
            fontSize: "1.2rem",
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            userSelect: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          {initials || "UN"}
        </div>
        <span
          style={{
            color: "#fff",
            fontWeight: "600",
            fontSize: "1rem",
            userSelect: "none",
          }}
        >
          {displayName}
        </span>

        {showDropdown && (
          <div
            id="profile-dropdown-menu"
            style={{
              position: "absolute",
              top: "calc(100% + 10px)",
              right: 0,
              backgroundColor: "#fff",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              borderRadius: "8px",
              overflow: "hidden",
              minWidth: "140px",
              animation: "fadeInScale 0.3s ease forwards",
              zIndex: 1100,
            }}
          >
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#e74c3c",
                color: "white",
                border: "none",
                width: "100%",
                padding: "12px 20px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "background-color 0.25s ease",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#c0392b")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#e74c3c")}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* CSS animation */}
      <style>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
