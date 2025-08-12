// Store the selected role (admin or employee) in localStorage
export const login = (user) => {
  // user is object {username, email, role}
  localStorage.setItem("loggedInUser", JSON.stringify(user));
  localStorage.setItem("userRole", user.role);
};

// Retrieve current logged-in role
export const getRole = () => {
  return localStorage.getItem("userRole");
};

// Clear role and user info on logout
export const logout = () => {
  localStorage.removeItem("userRole");
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("token");
};
