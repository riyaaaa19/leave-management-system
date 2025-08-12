import React, { useState, useEffect } from "react";
import { getLeaveRequests, updateLeaveStatus } from "../services/leaveService";

/**
 * Component to display and manage all leave requests (admin view).
 * Allows approving or rejecting pending requests.
 */
const LeaveRequests = () => {
  const [requests, setRequests] = useState([]); // Leave requests data
  const [loading, setLoading] = useState(false); // Loading indicator
  const [error, setError] = useState(null); // Error message

  // Fetch leave requests once on component mount
  useEffect(() => {
    async function fetchRequests() {
      setLoading(true);
      setError(null);
      try {
        const data = await getLeaveRequests();
        setRequests(data);
      } catch (err) {
        setError("Failed to fetch leave requests");
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, []);

  /**
   * Handle approving or rejecting a leave request.
   * Updates the state with the modified leave after backend response.
   * @param {number|string} id - ID of the leave request
   * @param {boolean} approved - true to approve, false to reject
   */
  const handleDecision = async (id, approved) => {
    setError(null);
    try {
      const status = approved ? "approved" : "rejected";
      const updatedLeave = await updateLeaveStatus(id, status);
      // Replace updated leave in requests list
      setRequests((prev) =>
        prev.map((leave) => (leave.id === id ? updatedLeave : leave))
      );
    } catch (err) {
      setError("Failed to update leave status");
    }
  };

  // Show loading or error messages
  if (loading) return <p>Loading leave requests...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <ul className="list-group">
      {requests.map((req) => (
        <li
          key={req.id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            {/* Display username fallback to employeeName if owner object missing */}
            <strong>{req.owner?.username || req.employeeName}</strong> –{" "}
            {req.reason} ({req.startDate} to {req.endDate})
          </div>

          <div>
            {req.status === "pending" ? (
              <>
                <button
                  className="btn btn-sm btn-success me-2"
                  onClick={() => handleDecision(req.id, true)}
                >
                  Approve
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDecision(req.id, false)}
                >
                  Reject
                </button>
              </>
            ) : (
              // Badge color indicates approved or rejected
              <span
                className={`badge ${
                  req.status === "approved" ? "bg-success" : "bg-danger"
                }`}
              >
                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default LeaveRequests;
