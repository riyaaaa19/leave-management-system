import React from "react";

/**
 * Component to display the list of leave requests in a card
 * @param {Array} leaves - Array of leave request objects with keys: id, reason, startDate, endDate, status
 */
const LeaveHistory = ({ leaves }) => {
  // If no leave requests, show friendly message
  if (!leaves || leaves.length === 0) {
    return (
      <div className="card p-3 shadow-sm">
        <h5>Leave History</h5>
        <p>No leave requests found.</p>
      </div>
    );
  }

  return (
    <div className="card p-3 shadow-sm">
      <h5>Leave History</h5>
      <ul className="list-group">
        {leaves.map((leave) => (
          <li key={leave.id} className="list-group-item">
            {/* Leave reason */}
            <strong>{leave.reason}</strong>
            <br />
            {/* Display date range */}
            {leave.startDate} to {leave.endDate}
            <br />
            {/* Leave status with colored badge */}
            Status:{" "}
            <span
              className={`badge bg-${
                leave.status === "approved"
                  ? "success"
                  : leave.status === "rejected"
                  ? "danger"
                  : "secondary"
              }`}
            >
              {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaveHistory;
