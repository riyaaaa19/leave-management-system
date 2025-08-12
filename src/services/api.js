const API_BASE = "http://127.0.0.1:8000";

// ----- AUTH -----
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
  if (data.user) {
    localStorage.setItem("loggedInUser", JSON.stringify(data.user));
  }

  return data;
};

// ----- REGISTER -----
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

// ----- APPLY LEAVE -----
export const applyLeave = async (leave) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/leaves/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(leave), // ✅ Correct keys sent from LeaveForm
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      Array.isArray(errorData.detail)
        ? errorData.detail.map((err) => `${err.loc.join(".")}: ${err.msg}`).join("\n")
        : errorData.detail || "Failed to apply for leave"
    );
  }
  return response.json();
};

// ----- FETCH MY LEAVES -----
export const fetchMyLeaves = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/leaves/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to fetch your leaves");
  }
  return response.json();
};

// ----- FETCH ALL LEAVES (ADMIN) -----
export const getLeaveRequests = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/leaves/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to fetch leave requests");
  }
  return response.json();
};

// ----- UPDATE LEAVE STATUS -----
export const updateLeaveStatus = async (id, status) => {
  const token = localStorage.getItem("token");
  const url = `${API_BASE}/leaves/${id}/status?status=${status}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to update leave status");
  }
  return response.json();
};
