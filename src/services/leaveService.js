const API_BASE = "http://127.0.0.1:8000";

/**
 * Apply for a new leave.
 * Converts camelCase keys to snake_case before sending.
 * @param {Object} leave - Leave data to submit (leaveType, startDate, endDate, reason)
 * @returns {Promise<Object>} Created leave object from backend
 */
export const applyLeave = async (leave) => {
  const token = localStorage.getItem("token");

  // Convert camelCase → snake_case for backend compatibility
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
      Authorization: `Bearer ${token}`, // Add auth token in header
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to apply for leave");
  }
  return response.json();
};

/**
 * Fetch leave requests of the currently logged-in user.
 * @returns {Promise<Array>} Array of leave requests
 */
export const fetchMyLeaves = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/leaves/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch your leave requests");
  }
  return response.json();
};

/**
 * Fetch all leave requests (typically for admin).
 * @returns {Promise<Array>} Array of all leave requests
 */
export const getLeaveRequests = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/leaves/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch leave requests");
  }
  return response.json();
};

/**
 * Update the status of a leave request to approved or rejected.
 * @param {number|string} id - Leave request ID
 * @param {string} status - New status ('approved' or 'rejected')
 * @returns {Promise<Object>} Updated leave request
 */
export const updateLeaveStatus = async (id, status) => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_BASE}/leaves/${id}/status?status=${status}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update leave status");
  }
  return response.json();
};
