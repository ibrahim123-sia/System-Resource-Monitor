import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const GPU = () => {
  const [gpuData, setGpuData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGPUInfo = async () => {
    try {
      const res = await axios.get("http://localhost:5000/GpuInfo");
      const newData = {
        utilization: parseInt(res.data.utilization),
        memoryUsed: parseFloat(res.data.memory.dedicated.split("/")[0]),
        time: new Date().toLocaleTimeString(),
      };

      setHistory((prev) => [...prev.slice(-14), newData]); // Keep last 15 data points
      setGpuData(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching GPU info:", err);
      setError("Failed to fetch GPU data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGPUInfo();
    const interval = setInterval(fetchGPUInfo, 2000);
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: history.map((data) => data.time),
    datasets: [
      {
        label: "GPU Utilization (%)",
        data: history.map((data) => data.utilization),
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.2)",
        tension: 0.4,
      },
      {
        label: "Memory Used (GB)",
        data: history.map((data) => data.memoryUsed),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        tension: 0.4,
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-red-500 text-xl">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />

      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">GPU Information</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart Section */}
          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-4">
              Performance Metrics
            </h2>
            <div className="h-80">
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { labels: { color: "#fff" } },
                  },
                  scales: {
                    x: { ticks: { color: "#9ca3af" } },
                    y: {
                      min: 0,
                      max: 100,
                      ticks: { color: "#9ca3af" },
                      title: {
                        text: "Percentage/GB",
                        display: true,
                        color: "#9ca3af",
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-4">
              Current Status
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-orange-400 font-medium">Utilization</h3>
                <p className="text-2xl text-white">{gpuData.utilization}</p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-emerald-400 font-medium">
                  Dedicated Memory
                </h3>
                <p className="text-2xl text-white">
                  {gpuData.memory.dedicated}
                </p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-emerald-400 font-medium">Shared Memory</h3>
                <p className="text-2xl text-white">{gpuData.memory.shared}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-4">
              Hardware Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-orange-400 font-medium">Model</h3>
                <p className="text-white text-lg">{gpuData.model}</p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-orange-400 font-medium">Vendor</h3>
                <p className="text-white text-lg">{gpuData.vendor}</p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-orange-400 font-medium">Driver Version</h3>
                <p className="text-white text-lg">
                  {gpuData.driverVersion || "Information not available"}
                </p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-orange-400 font-medium">Driver Date</h3>
                <p className="text-white text-lg">
                  {gpuData.driverDate || "Information not available"}
                </p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-orange-400 font-medium">DirectX Version</h3>
                <p className="text-white text-lg">{gpuData.directXVersion}</p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-orange-400 font-medium">Location</h3>
                <p className="text-white text-lg">{gpuData.physicalLocation}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPU;
