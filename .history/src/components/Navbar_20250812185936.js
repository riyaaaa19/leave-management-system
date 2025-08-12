import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";  // Adjust path as needed

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedUser) {
      navigate("/login", { replace: true });
    } else {
      setUser(loggedUser);
    }

    // Optional: listen for storage changes in case user logs in/out in another tab
    function handleStorageChange() {
      const updatedUser = JSON.parse(localStorage.getItem("loggedInUser"));
      setUser(updatedUser);
    }
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [navigate]);

  if (!user) return null;

  return (
    <nav
      style={{
        background: "linear-gradient(90deg, #3a7bd5 0%, #00d2ff 100%)",
        padding: "10px 30px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span
        style={{
          fontSize: "1.8rem",
          letterSpacing: "1.2px",
          color: "#fff",
          fontWeight: "700",
        }}
      >
        Leave Management
      </span>

      {/* Show Profile Dropdown */}
      <ProfileDropdown username={user.username} />
    </nav>
  );
}

export default Navbar;
