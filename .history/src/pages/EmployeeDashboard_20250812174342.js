import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import { fetchMyLeaves, applyLeave } from "../services/api";

// --- Helper function: Get initials from username ---
const getInitials = (name) => {
  if (!name) return "UN";
  return name.slice(0, 2).toUpperCase();
};

// --- Leave type limits (company policy) ---
const LEAVE_LIMITS = {
  Annual: 20,
  Sick: 10,
  Marriage: 5,
  "Maternity/Paternity": 30,
};

function EmployeeDashboard() {
  // --- Store logged-in user info from localStorage ---
  const storedUser = useMemo(() => {
    const userJson = localStorage.getItem("loggedInUser");
    return userJson ? JSON.parse(userJson) : null;
  }, []);

  // --- Form states for applying leave ---
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [leaveType, setLeaveType] = useState("Annual");
  const [reason, setReason] = useState("");

  // --- Leave request data & UI states ---
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Calculate used leaves from approved requests ---
  const usedLeaves = leaveRequests.reduce((acc, leave) => {
    if (leave.status?.toLowerCase() === "approved") {
      const start = new Date(leave.start_date);
      const end = new Date(leave.end_date);
      const daysUsed = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      acc[leave.leave_type] = (acc[leave.leave_type] || 0) + daysUsed;
    }
    return acc;
  }, {});

  // --- Remaining leaves calculation ---
  const remainingLeaves = {};
  for (const [type, limit] of Object.entries(LEAVE_LIMITS)) {
    remainingLeaves[type] = Math.max(limit - (usedLeaves[type] || 0), 0);
  }

  // --- Date formatter for UI ---
  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  // --- Load all user's leave requests ---
  useEffect(() => {
    if (!storedUser) return;

    const loadLeaves = async () => {
      setLoading(true);
      setError(null);
      try {
        const leaves = await fetchMyLeaves();
        setLeaveRequests(leaves);
      } catch (err) {
        setError("Failed to load your leave requests.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadLeaves();
  }, [storedUser]);

  // --- Handle leave application ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!storedUser) return;

    if (new Date(startDate) > new Date(endDate)) {
      alert("Start Date cannot be after End Date.");
      return;
    }

    const newLeave = {
      leaveType,
      startDate,
      endDate,
      reason,
    };

    try {
      const createdLeave = await applyLeave(newLeave);
      setLeaveRequests((prev) => [...prev, createdLeave]);
      setStartDate("");
      setEndDate("");
      setReason("");
      setLeaveType("Annual");
      alert("Leave request submitted successfully ✅");
    } catch (err) {
      alert(err.message || "Failed to submit leave request.");
    }
  };

  // --- If not logged in, block access ---
  if (!storedUser) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 24,
          color: "#444",
          background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
        }}
      >
        Please login first to access your dashboard.
      </div>
    );
  }

  return (
    <>
      {/* Navbar with username */}
      <Navbar
        profileInitials={getInitials(storedUser.username)}
        username={storedUser.username || "User"}
      />

      {/* Main content container */}
      <div
        style={{
          maxWidth: 1100,
          margin: "40px auto 80px",
          padding: "20px 30px",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          background: "linear-gradient(135deg, #e0eafc, #cfdef3)",
          borderRadius: 20,
          boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
        }}
      >
        {/* Leave Balances Header */}
        <h2
          style={{
            color: "#2c3e50",
            marginBottom: 30,
            fontWeight: "700",
            textAlign: "center",
            fontSize: "2rem",
            letterSpacing: "1.2px",
            textShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          Your Leave Balances
        </h2>

        {/* Leave Balances Cards */}
        <div
          style={{
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: 30,
          }}
        >
          {Object.entries(remainingLeaves).map(([type, remaining]) => {
            const total = LEAVE_LIMITS[type];
            const used = total - remaining;
            const percentage = (used / total) * 100;

            const cardColor =
              remaining > total * 0.5
                ? "#27ae60"
                : remaining > total * 0.2
                ? "#f39c12"
                : "#c0392b";

            return (
              <div
                key={type}
                style={{
                  background: `linear-gradient(135deg, ${cardColor}cc, ${cardColor}ee)`,
                  boxShadow:
                    "0 12px 25px rgba(0, 0, 0, 0.15), 0 6px 12px rgba(0, 0, 0, 0.1)",
                  borderRadius: 18,
                  padding: 25,
                  width: 240,
                  color: "white",
                  fontWeight: "600",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                <h3 style={{ fontSize: 22, marginBottom: 12 }}>{type} Leave</h3>
                <p style={{ fontSize: 15, opacity: 0.9 }}>
                  Remaining: <strong>{remaining} days</strong>
                </p>
                <div
                  style={{
                    height: 14,
                    width: "100%",
                    backgroundColor: "#ffffff33",
                    borderRadius: 10,
                    marginTop: 15,
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${percentage}%`,
                      backgroundColor: "#fff",
                      borderRadius: 10,
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>
                <p
                  style={{
                    fontSize: 14,
                    marginTop: 12,
                    opacity: 0.85,
                    textAlign: "right",
                  }}
                >
                  Used: {used} / {total} days
                </p>
              </div>
            );
          })}
        </div>

        {/* RECENT LEAVE REQUEST CARD */}
        {leaveRequests.length > 0 && (
          <div
            style={{
              background: "#fff",
              boxShadow: "0 12px 25px rgba(0, 0, 0, 0.1)",
              borderRadius: 18,
              padding: 25,
              maxWidth: 500,
              margin: "0 auto 50px",
              textAlign: "center",
              border: "2px solid #ecf0f1",
            }}
          >
            <h3 style={{ marginBottom: 15, color: "#2c3e50", fontWeight: "700" }}>
              Recent Leave Request
            </h3>
            {(() => {
              const recentLeave = [...leaveRequests].sort(
                (a, b) =>
                  new Date(b.start_date).getTime() -
                  new Date(a.start_date).getTime()
              )[0];
              return (
                <>
                  <p style={{ fontSize: 16, margin: "6px 0", fontWeight: "600" }}>
                    {recentLeave.leave_type}
                  </p>
                  <p style={{ margin: "4px 0", color: "#7f8c8d" }}>
                    {formatDate(recentLeave.start_date)} →{" "}
                    {formatDate(recentLeave.end_date)}
                  </p>
                  <p
                    style={{
                      fontWeight: "700",
                      color:
                        recentLeave.status?.toLowerCase() === "approved"
                          ? "#27ae60"
                          : recentLeave.status?.toLowerCase() === "rejected"
                          ? "#c0392b"
                          : "#f39c12",
                    }}
                  >
                    {recentLeave.status
                      ? recentLeave.status.charAt(0).toUpperCase() +
                        recentLeave.status.slice(1)
                      : "Pending"}
                  </p>
                  <p
                    style={{
                      fontStyle: "italic",
                      color: "#34495e",
                      marginTop: 8,
                    }}
                  >
                    {recentLeave.reason}
                  </p>
                </>
              );
            })()}
          </div>
        )}

        {/* LEAVE APPLICATION FORM */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: 35,
            borderRadius: 20,
            boxShadow:
              "0 12px 30px rgba(41, 128, 185, 0.15), 0 6px 15px rgba(41, 128, 185, 0.1)",
            marginBottom: 60,
          }}
        >
          <h2
            style={{
              marginBottom: 32,
              fontWeight: "700",
              color: "#34495e",
              textAlign: "center",
              fontSize: "1.9rem",
            }}
          >
            Apply for Leave
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Select + Dates */}
            <div
              style={{
                display: "flex",
                gap: 24,
                flexWrap: "wrap",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                style={{
                  flex: "1 1 220px",
                  padding: 14,
                  borderRadius: 10,
                  border: "1.8px solid #2980b9",
                  fontSize: 17,
                  fontWeight: "600",
                  color: "#2980b9",
                }}
                required
              >
                <option value="Annual">Annual Leave</option>
                <option value="Sick">Sick Leave</option>
                <option value="Marriage">Marriage Leave</option>
                <option value="Maternity/Paternity">
                  Maternity/Paternity Leave
                </option>
              </select>

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  flex: "1 1 160px",
                  padding: 14,
                  borderRadius: 10,
                  border: "1.8px solid #2980b9",
                  fontSize: 16,
                }}
                required
              />

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  flex: "1 1 160px",
                  padding: 14,
                  borderRadius: 10,
                  border: "1.8px solid #2980b9",
                  fontSize: 16,
                }}
                required
              />
            </div>

            {/* Reason */}
            <textarea
              placeholder="Reason for leave"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{
                width: "100%",
                minHeight: 110,
                padding: 16,
                borderRadius: 12,
                border: "1.8px solid #2980b9",
                fontSize: 16,
                resize: "vertical",
              }}
              required
            />

            {/* Submit */}
            <button
              type="submit"
              style={{
                marginTop: 28,
                width: "100%",
                padding: 16,
                borderRadius: 14,
                background:
                  "linear-gradient(135deg, #2980b9, #6dd5fa, #2980b9)",
                color: "white",
                fontWeight: "700",
                fontSize: 20,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(41, 128, 185, 0.6)",
              }}
            >
              Submit Leave Request
            </button>
          </form>
        </div>

        {/* LEAVE HISTORY TABLE */}
        <h2
          style={{
            fontWeight: "700",
            color: "#2c3e50",
            marginBottom: 24,
            textAlign: "center",
            fontSize: "1.8rem",
          }}
        >
          Leave History
        </h2>

        {loading && (
          <p
            style={{
              textAlign: "center",
              fontSize: 18,
              color: "#2980b9",
              fontWeight: "600",
            }}
          >
            Loading your leaves...
          </p>
        )}
        {error && (
          <p
            style={{
              color: "#c0392b",
              textAlign: "center",
              marginBottom: 30,
              fontWeight: "600",
            }}
          >
            {error}
          </p>
        )}

        {!loading && !error && (
          <div
            style={{
              overflowX: "auto",
              borderRadius: 20,
              boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
              backgroundColor: "white",
              padding: 24,
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: "0 10px",
                fontSize: 17,
                color: "#34495e",
              }}
            >
              <thead>
                <tr>
                  {["Type", "From", "To", "Reason", "Status"].map((h, idx) => (
                    <th
                      key={idx}
                      style={{
                        padding: 16,
                        textAlign: "left",
                        color: "#fff",
                        backgroundColor: "#2980b9",
                        userSelect: "none",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leaveRequests.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        textAlign: "center",
                        padding: 24,
                        fontStyle: "italic",
                        color: "#7f8c8d",
                      }}
                    >
                      No leave requests found.
                    </td>
                  </tr>
                )}
                {leaveRequests.map((leave) => (
                  <tr
                    key={leave.id}
                    style={{
                      backgroundColor:
                        leave.status?.toLowerCase() === "approved"
                          ? "#d4edda"
                          : leave.status?.toLowerCase() === "rejected"
                          ? "#f8d7da"
                          : "#ecf0f1",
                    }}
                  >
                    <td style={{ padding: 16 }}>{leave.leave_type}</td>
                    <td style={{ padding: 16 }}>
                      {formatDate(leave.start_date)}
                    </td>
                    <td style={{ padding: 16 }}>
                      {formatDate(leave.end_date)}
                    </td>
                    <td style={{ padding: 16 }}>{leave.reason}</td>
                    <td
                      style={{
                        padding: 16,
                        fontWeight: "700",
                        color:
                          leave.status?.toLowerCase() === "approved"
                            ? "#27ae60"
                            : leave.status?.toLowerCase() === "rejected"
                            ? "#c0392b"
                            : "#7f8c8d",
                      }}
                    >
                      {leave.status
                        ? leave.status.charAt(0).toUpperCase() +
                          leave.status.slice(1)
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default EmployeeDashboard;
