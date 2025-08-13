import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom"; // for redirect if not logged in
import Navbar from "../components/Navbar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
import { Bar } from "react-chartjs-2";


const getInitials = (name) => {
  if (!name) return "UN";
  return name.slice(0, 2).toUpperCase();
};

// Format ISO date strings to readable format
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
};

function AdminDashboard() {
  const navigate = useNavigate();

  // Memoize logged-in user info from localStorage
  const storedUser = useMemo(() => {
    const userJson = localStorage.getItem("loggedInUser");
    return userJson ? JSON.parse(userJson) : null;
  }, []);

  // Redirect to login if no user or user is not admin
  useEffect(() => {
    if (!storedUser) {
      navigate("/login");
    } else if (storedUser.role?.toLowerCase() !== "admin") {
      // If your user object has a role property
      alert("Access denied: Admins only");
      navigate("/login");
    }
  }, [storedUser, navigate]);

  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch leave requests on mount
  useEffect(() => {
    async function fetchLeaves() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found");

        const res = await fetch("http://127.0.0.1:8000/leaves/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch leave requests");

        const data = await res.json();
        setLeaveRequests(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaves();
  }, []);

  const handleDecision = async (id, approved) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const status = approved ? "approved" : "rejected";

      const res = await fetch(
        `http://127.0.0.1:8000/leaves/${id}/status?status=${status}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to update leave status");

      const updatedLeave = await res.json();

      setLeaveRequests((prev) =>
        prev.map((leave) => (leave.id === id ? updatedLeave : leave))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Monthly leaves count for chart
  const monthlyCounts = Array(12).fill(0);
  leaveRequests.forEach((leave) => {
    if (leave.start_date) {
      const month = new Date(leave.start_date).getMonth();
      monthlyCounts[month]++;
    }
  });

  const chartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Leaves Taken",
        data: monthlyCounts,
        backgroundColor: "rgba(9, 155, 245, 0.7)",
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { font: { size: 14 } } },
      title: {
        display: true,
        text: "Leaves Taken by Month",
        font: { size: 18, weight: "bold" },
      },
    },
  };

  const today = new Date().toISOString().split("T")[0];
  const onLeaveToday = leaveRequests.filter(
    (leave) =>
      leave.status?.toLowerCase() === "approved" &&
      leave.start_date <= today &&
      leave.end_date >= today
  );

  // Summary stats for cards
  const totalLeaves = leaveRequests.length;
  const pendingLeaves = leaveRequests.filter(
    (l) => l.status?.toLowerCase() === "pending"
  ).length;
  const approvedLeaves = leaveRequests.filter(
    (l) => l.status?.toLowerCase() === "approved"
  ).length;
  const rejectedLeaves = leaveRequests.filter(
    (l) => l.status?.toLowerCase() === "rejected"
  ).length;

  // Latest pending leave for card
  const latestPendingLeave = [...leaveRequests]
    .filter((l) => l.status?.toLowerCase() === "pending")
    .sort(
      (a, b) =>
        new Date(b.created_at || b.start_date) - new Date(a.created_at || a.start_date)
    )[0];

  // Block render until login check done
  if (!storedUser) return null;

  return (
    <>
      <Navbar
        profileInitials={getInitials(storedUser?.username)}
        username={storedUser?.username || "User"}
      />

      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 40%, #bcccdc 100%)",
          padding: "40px 20px 60px",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          color: "#34495e",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: 40, fontWeight: "700" }}>
          Admin Dashboard
        </h1>

        {error && (
          <p
            style={{
              color: "#c0392b",
              textAlign: "center",
              fontWeight: "600",
              marginBottom: 20,
            }}
          >
            {error}
          </p>
        )}

        {loading ? (
          <p style={{ textAlign: "center", fontSize: 18 }}>Loading...</p>
        ) : (
          <>
            {/* Summary Cards */}
            <div
              style={{
                display: "flex",
                gap: 24,
                justifyContent: "center",
                marginBottom: 30,
                flexWrap: "wrap",
              }}
            >
              {[
                {
                  label: "Total Leaves",
                  count: totalLeaves,
                  color: "#2980b9",
                  icon: "📋",
                },
                {
                  label: "Pending Leaves",
                  count: pendingLeaves,
                  color: "#f39c12",
                  icon: "⏳",
                },
                {
                  label: "Approved Leaves",
                  count: approvedLeaves,
                  color: "#27ae60",
                  icon: "✅",
                },
                {
                  label: "Rejected Leaves",
                  count: rejectedLeaves,
                  color: "#c0392b",
                  icon: "❌",
                },
              ].map(({ label, count, color, icon }) => (
                <div
                  key={label}
                  style={{
                    background: `linear-gradient(135deg, ${color}cc, ${color}ee)`,
                    color: "white",
                    borderRadius: 15,
                    padding: 20,
                    width: 220,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                    fontSize: 20,
                    userSelect: "none",
                    cursor: "default",
                    animation: "fadeInUp 0.8s ease forwards",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateY(-6px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                  }
                >
                  <div
                    style={{
                      fontSize: 36,
                      marginBottom: 10,
                      filter: "drop-shadow(1px 1px 2px rgba(0,0,0,0.3))",
                    }}
                  >
                    {icon}
                  </div>
                  <div>{label}</div>
                  <div style={{ fontSize: 40, marginTop: 8 }}>{count}</div>
                </div>
              ))}
            </div>

            {/* Latest Pending Leave Request Card */}
            <div
              style={{
                maxWidth: 1100,
                margin: "0 auto 40px",
                padding: 24,
                background: "white",
                borderRadius: 15,
                boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                animation: "fadeInUp 1s ease forwards",
              }}
            >
              <h3
                style={{
                  fontWeight: "700",
                  marginBottom: 20,
                  color: "#34495e",
                  textAlign: "center",
                  fontSize: 22,
                }}
              >
                Latest Pending Leave Request
              </h3>

              {!latestPendingLeave ? (
                <p style={{ textAlign: "center", color: "#7f8c8d", fontSize: 16 }}>
                  No pending leave requests.
                </p>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    maxWidth: 600,
                    margin: "0 auto",
                    padding: 20,
                    borderRadius: 12,
                    border: "1px solid #ddd",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                  }}
                >
                  <div style={{ fontWeight: "600", fontSize: 20, color: "#2980b9" }}>
                    {latestPendingLeave.owner?.username || "Unknown User"}
                  </div>
                  <div>
                    <strong>Type:</strong> {latestPendingLeave.leave_type}
                  </div>
                  <div>
                    <strong>From:</strong> {formatDate(latestPendingLeave.start_date)}
                  </div>
                  <div>
                    <strong>To:</strong> {formatDate(latestPendingLeave.end_date)}
                  </div>
                  <div>
                    <strong>Reason:</strong> {latestPendingLeave.reason}
                  </div>

                  <div style={{ display: "flex", gap: 14, marginTop: 16 }}>
                    <button
                      onClick={() => handleDecision(latestPendingLeave.id, true)}
                      style={{
                        background: "linear-gradient(135deg, #27ae60, #2ecc71)",
                        color: "#fff",
                        border: "none",
                        padding: "12px 24px",
                        cursor: "pointer",
                        borderRadius: 8,
                        fontWeight: "600",
                        flex: 1,
                        transition: "background 0.3s ease",
                        boxShadow: "0 4px 12px rgba(39, 174, 96, 0.6)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "linear-gradient(135deg, #2ecc71, #27ae60)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          "linear-gradient(135deg, #27ae60, #2ecc71)")
                      }
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDecision(latestPendingLeave.id, false)}
                      style={{
                        background: "linear-gradient(135deg, #c0392b, #e74c3c)",
                        color: "#fff",
                        border: "none",
                        padding: "12px 24px",
                        cursor: "pointer",
                        borderRadius: 8,
                        fontWeight: "600",
                        flex: 1,
                        transition: "background 0.3s ease",
                        boxShadow: "0 4px 12px rgba(192, 57, 43, 0.6)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "linear-gradient(135deg, #e74c3c, #c0392b)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          "linear-gradient(135deg, #c0392b, #e74c3c)")
                      }
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Chart and On Leave Today */}
            <div
              style={{
                display: "flex",
                gap: 24,
                marginBottom: 40,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  flex: "1 1 65%",
                  background: "white",
                  padding: 24,
                  borderRadius: 15,
                  boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                  minWidth: 320,
                }}
              >
                <Bar data={chartData} options={chartOptions} />
              </div>

              <div
                style={{
                  flex: "1 1 30%",
                  background: "white",
                  padding: 20,
                  borderRadius: 15,
                  boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                  minWidth: 280,
                  maxHeight: 320,
                  overflowY: "auto",
                }}
              >
                <h3
                  style={{
                    fontWeight: "700",
                    marginBottom: 16,
                    color: "#34495e",
                    textAlign: "center",
                  }}
                >
                  On Leave Today
                </h3>
                {onLeaveToday.length > 0 ? (
                  <ul
                    style={{
                      listStyle: "none",
                      paddingLeft: 0,
                      fontSize: 16,
                      color: "#2c3e50",
                    }}
                  >
                    {onLeaveToday.map((leave) => (
                      <li
                        key={leave.id}
                        style={{
                          padding: "8px 0",
                          borderBottom: "1px solid #f10d0dff",
                          fontWeight: "600",
                        }}
                      >
                        {leave.owner?.username || "Unknown"} — {leave.leave_type}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ textAlign: "center", color: "#0ce8f8ff" }}>
                    No one is on leave today.
                  </p>
                )}
              </div>
            </div>

            {/* Leave History Table */}
            <div
              style={{
                background: "white",
                padding: 24,
                borderRadius: 15,
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                overflowX: "auto",
              }}
            >
              <h3
                style={{
                  fontWeight: "700",
                  marginBottom: 16,
                  color: "#34495e",
                  textAlign: "center",
                }}
              >
                All Leave History
              </h3>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 16,
                  color: "#34495e",
                }}
              >
                <thead
                  style={{
                    backgroundColor: "#2980b9",
                    color: "white",
                    borderRadius: "15px 15px 0 0",
                    userSelect: "none",
                  }}
                >
                  <tr>
                    <th style={{ padding: 14, textAlign: "left" }}>Name</th>
                    <th style={{ padding: 14, textAlign: "left" }}>Type</th>
                    <th style={{ padding: 14, textAlign: "left" }}>From</th>
                    <th style={{ padding: 14, textAlign: "left" }}>To</th>
                    <th style={{ padding: 14, textAlign: "left" }}>Reason</th>
                    <th style={{ padding: 14, textAlign: "left" }}>Status</th>
                    <th style={{ padding: 14, textAlign: "left" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        style={{
                          textAlign: "center",
                          padding: 20,
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
                            : "#fff",
                        transition: "background-color 0.3s ease",
                      }}
                    >
                      <td style={{ padding: 12 }}>{leave.owner?.username || ""}</td>
                      <td style={{ padding: 12 }}>{leave.leave_type}</td>
                      <td style={{ padding: 12 }}>{formatDate(leave.start_date)}</td>
                      <td style={{ padding: 12 }}>{formatDate(leave.end_date)}</td>
                      <td style={{ padding: 12 }}>{leave.reason}</td>
                      <td
                        style={{
                          padding: 12,
                          fontWeight: "700",
                          color:
                            leave.status?.toLowerCase() === "approved"
                              ? "#27ae60"
                              : leave.status?.toLowerCase() === "rejected"
                              ? "#c0392b"
                              : "#7f8c8d",
                          textTransform: "capitalize",
                        }}
                      >
                        {leave.status || ""}
                      </td>
                      <td style={{ padding: 12 }}>
                        {leave.status?.toLowerCase() === "pending" ? (
                          <>
                            <button
                              onClick={() => handleDecision(leave.id, true)}
                              style={{
                                background:
                                  "linear-gradient(135deg, #27ae60, #2ecc71)",
                                color: "#fff",
                                marginRight: 8,
                                border: "none",
                                padding: "8px 14px",
                                cursor: "pointer",
                                borderRadius: 6,
                                fontWeight: "600",
                                transition: "background 0.3s ease",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.background =
                                  "linear-gradient(135deg, #2ecc71, #27ae60)")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.background =
                                  "linear-gradient(135deg, #27ae60, #2ecc71)")
                              }
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleDecision(leave.id, false)}
                              style={{
                                background:
                                  "linear-gradient(135deg, #c0392b, #e74c3c)",
                                color: "#fff",
                                border: "none",
                                padding: "8px 14px",
                                cursor: "pointer",
                                borderRadius: 6,
                                fontWeight: "600",
                                transition: "background 0.3s ease",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.background =
                                  "linear-gradient(135deg, #e74c3c, #c0392b)")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.background =
                                  "linear-gradient(135deg, #c0392b, #e74c3c)")
                              }
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Scrollbar for On Leave Today list */
        div[style*="overflowY: auto"]::-webkit-scrollbar {
          width: 8px;
        }
        div[style*="overflowY: auto"]::-webkit-scrollbar-thumb {
          background-color: rgba(41, 128, 185, 0.5);
          border-radius: 4px;
        }
      `}</style>
    </>
  );
}

export default AdminDashboard;
