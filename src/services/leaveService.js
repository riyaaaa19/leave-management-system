const API_BASE = "https://leave-management-system-cltb.onrender.com";

// ----- APPLY LEAVE (USER) -----
export const applyLeave = async (leave) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not logged in");

  const payload = {
    leave_type: leave.leaveType,
    start_date: leave.startDate,
    end_date: leave.endDate,
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
