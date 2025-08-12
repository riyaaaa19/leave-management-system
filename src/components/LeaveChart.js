import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js components once globally
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * LeaveChart component renders a bar chart showing
 * number of leaves taken by month.
 */
const LeaveChart = () => {
  // Example static data - replace with dynamic data as needed
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], // X-axis labels for months
    datasets: [
      {
        label: "Leaves Taken", // Dataset label shown in legend
        data: [2, 3, 4, 1, 2, 5], // Number of leaves for each month
        backgroundColor: "rgba(54, 162, 235, 0.6)", // Bar color with opacity
      },
    ],
  };

  // Chart options for responsive design and plugins
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top", // Legend at the top
      },
      title: {
        display: true,
        text: "Leaves Taken by Month", // Chart title
      },
    },
  };

  // Render the bar chart with given data and options
  return <Bar data={data} options={options} />;
};

export default LeaveChart;
