import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProfileDropdown({ username = "User" }) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setShowMenu((prev) => !prev);

  const handleLogoutClick = () => {
    setShowMenu(false);
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const getInitials = (name) => {
    if (!name) return "UN";
    const parts = name.trim().split(" ");
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    } else {
      return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
    }
  };

  const initials = getInitials(username);

  return (
    <div style={{ position: "relative", cursor: "pointer" }}>
      <div
        onClick={toggleMenu}
        style={{ display: "flex", alignItems: "center", gap: "10px", color: "white" }}
      >
        <img
          src={`https://ui-avatars.com/api/?name=${initials}&background=random&rounded=true&size=64`}
          alt="profile"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "2px solid white",
          }}
        />
        <span style={{ fontWeight: "bold" }}>{username}</span>
      </div>

      {showMenu && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "100%",
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            padding: "10px",
            borderRadius: "5px",
            zIndex: 100,
            minWidth: "100px",
          }}
        >
          <button
            onClick={handleLogoutClick}
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
