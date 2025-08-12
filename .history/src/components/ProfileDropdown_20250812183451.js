import React, { useState } from "react";

function ProfileDropdown({ username = "User", onLogout }) {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => setShowMenu((prev) => !prev);

  const handleLogoutClick = () => {
    setShowMenu(false);
    if (onLogout) onLogout();
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
        style={{ display: "flex", alignItems: "center", gap: "10px" }}
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
        <span style={{ fontWeight: "bold", color: "white" }}>{username}</span>
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
