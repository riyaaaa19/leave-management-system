const API_BASE =
  process.env.REACT_APP_API_BASE_URL ||
  "https://leave-management-system-cltb.onrender.com";

// ----- AUTH: LOGIN -----
export const loginUser = async ({ email, password }) => {
  const formBody = new URLSearchParams();
  formBody.append("username", email);
  formBody.append("password", password);

  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formBody.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Login failed");
  }

  const data = await response.json();
  localStorage.setItem("token", data.access_token);
  if (data.user) localStorage.setItem("loggedInUser", JSON.stringify(data.user));

  return data;
};

// ----- AUTH: REGISTER -----
export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Registration failed");
  }
  return response.json();
};

// ----- ADMIN: GET ALL LEAVES -----
export const getLeaveRequests = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Admin not logged in");

  const response = await fetch(`${API_BASE}/leaves/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to fetch leave requests");
  }
  return response.json();
};

// ----- ADMIN: UPDATE LEAVE STATUS -----
export const updateLeaveStatus = async (id, status) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Admin not logged in");

  const response = await fetch(`${API_BASE}/leaves/${id}/status?status=${status}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to update leave status");
  }
  return response.json();
};
