// auth.js

// Store the selected role (admin or employee) in localStorage
export const login = (role) => {
  localStorage.setItem("userRole", role);
};

// Retrieve current logged-in role
export const getRole = () => {
  return localStorage.getItem("userRole");
};

// Clear role on logout
export const logout = () => {
  localStorage.removeItem("userRole");
  localStorage.removeItem("token");
  localStorage.removeItem("loggedInUser");
};
