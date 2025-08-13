const API_BASE =
  process.env.REACT_APP_API_BASE_URL ||
  "https://leave-management-system-cltb.onrender.com";

// ----- APPLY LEAVE (USER) -----
export const applyLeave = async (leave) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not logged in");

  const payload = {
    leave_type: leave.leave_type,   // snake_case keys match backend
    start_date: leave.start_date,
    end_date: leave.end_date,
    reason: leave.reason,
  };

  const response = await fetch(`${API_BASE}/leaves/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
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

// ----- FETCH MY LEAVES (USER) -----
export const fetchMyLeaves = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not logged in");

  const response = await fetch(`${API_BASE}/leaves/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to fetch your leaves");
  }
  return response.json();
};
