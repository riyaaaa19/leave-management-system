import React, { useState, useEffect } from "react";
import { applyLeave, fetchMyLeaves } from "../services/api"; // ya leaveService.js

function LeaveForm({ username }) {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadLeaves() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMyLeaves();
        setRequests(data);
      } catch (err) {
        setError("Failed to load leave requests");
      } finally {
        setLoading(false);
      }
    }
    loadLeaves();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // ✅ Match backend schema exactly
    const newRequest = {
      leave_type: leaveType,
      start_date: startDate, // YYYY-MM-DD string
      end_date: endDate,     // YYYY-MM-DD string
      reason: reason,
    };

    console.log("📤 Sending leave request:", newRequest); // Debugging

    try {
      await applyLeave(newRequest);
      const updatedRequests = await fetchMyLeaves();
      setRequests(updatedRequests);

      setLeaveType("");
      setStartDate("");
      setEndDate("");
      setReason("");

      alert("Leave request submitted successfully!");
    } catch (err) {
      console.error("❌ Leave request failed:", err);
      setError("Failed to submit leave request");
    }
  };

  return (
    <div className="card p-4 shadow-sm">
      <h4>Apply for Leave</h4>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Leave Type</label>
          <select
            className="form-control"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            required
          >
            <option value="">Select type</option>
            <option value="sick">Sick</option>
            <option value="casual">Casual</option>
            <option value="earned">Earned</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Start Date</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>End Date</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Reason</label>
          <textarea
            className="form-control"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>

      <hr />

      <h5>Your Leave Requests</h5>
      {loading ? (
        <p>Loading leave requests...</p>
      ) : requests.length === 0 ? (
        <p>No leave requests found.</p>
      ) : (
        <ul className="list-group">
          {requests.map((leave) => (
            <li key={leave.id} className="list-group-item">
              <strong>{leave.reason}</strong>
              <br />
              {leave.start_date} to {leave.end_date}
              <br />
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
                {leave.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LeaveForm;
