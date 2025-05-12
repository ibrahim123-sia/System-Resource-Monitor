import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Main = () => {
  const [processes, setProcesses] = useState([]);
  const [CPU, setCPU] = useState();
  const [Memory, setMemory] = useState();
  const [Disk, setDisk] = useState();
  const [GPU, setGPU] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProcessInfo = async () => {
    try {
      const res = await axios.get("http://localhost:5000/ProcessInfo");
      setProcesses(res.data);
    } catch (err) {
      console.error("Error fetching processes:", err);
      throw new Error("Failed to fetch processes");
    }
  };

  const fetchCPUInfo = async () => {
    try {
      const res = await axios.get("http://localhost:5000/CPUInfo");
      setCPU(res.data);
    } catch (err) {
      console.error("Error fetching CPU:", err);
      throw new Error("Failed to fetch CPU data");
    }
  };

  const fetchMemoryInfo = async () => {
    try {
      const res = await axios.get("http://localhost:5000/MemoryInfo");
      setMemory(res.data);
    } catch (err) {
      console.error("Error fetching memory:", err);
      throw new Error("Failed to fetch memory data");
    }
  };

  const fetchDiskInfo = async () => {
    try {
      const res = await axios.get("http://localhost:5000/DiskInfo");
      setDisk(res.data);
    } catch (err) {
      console.error("Error fetching disk:", err);
      throw new Error("Failed to fetch disk data");
    }
  };

  const fetchGPUInfo = async () => {
    try {
      const res = await axios.get("http://localhost:5000/GPUInfo");
      setGPU(res.data);
    } catch (err) {
      console.error("Error fetching GPU:", err);
      throw new Error("Failed to fetch GPU data");
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchProcessInfo(),
          fetchCPUInfo(),
          fetchMemoryInfo(),
          fetchDiskInfo(),
          fetchGPUInfo(),
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    const interval = setInterval(() => {
      Promise.all([
        fetchProcessInfo().catch(console.error),
        fetchCPUInfo().catch(console.error),
        fetchMemoryInfo().catch(console.error),
        fetchDiskInfo().catch(console.error),
        fetchGPUInfo().catch(console.error),
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getMemoryPercent = () =>
    Memory ? ((Memory.usedmemory / Memory.totalmemory) * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
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
    <div className="bg-gray-900">
      <Navbar />

      <div className="p-10 flex gap-10 flex-wrap justify-center">
        <div className="w-[560px]">
          <table className="w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-700 text-gray-300 uppercase text-[16px] leading-normal">
                <th className="py-2 px-6 text-left">PID</th>
                <th className="py-2 px-6 text-left">Process</th>
                <th className="py-2 px-6 text-left">CPU</th>
                <th className="py-2 px-6 text-left">Memory</th>
                <th className="py-2 px-6 text-left">Power</th>
              </tr>
            </thead>
            <tbody className="text-gray-300 text-[15px] font-light">
              {processes.map((proc) => (
                <tr
                  key={proc.pid}
                  className="border-b border-gray-700 hover:bg-gray-700 transition"
                >
                  <td className="py-3 px-6">{proc.pid}</td>
                  <td className="py-3 px-6">{proc.name}</td>
                  <td className="py-3 px-6">{proc.cpu.toFixed(1)}%</td>
                  <td className="py-3 px-6">{proc.mem.toFixed(1)}%</td>
                  <td className="py-3 px-6">{proc.power}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
          <ChartBox
            title="CPU Load"
            percent={CPU?.load?.totalLoadPercent?.toFixed(1) || 0}
            color="#4ade80"
            details={
              <>
                <p className="text-green-400">
                  System Load: {CPU?.load?.systemLoadPercent?.toFixed(1)}%
                </p>
                <p className="text-blue-400">
                  User Load: {CPU?.load?.userLoadPercent?.toFixed(1)}%
                </p>
                <p className="text-yellow-400">
                  Processes: {CPU?.totalprocess ?? "Loading..."}
                </p>
              </>
            }
          />

          <ChartBox
            title="Memory Usage"
            percent={getMemoryPercent()}
            color="#60a5fa"
            details={
              <>
                <p className="text-purple-400">
                  Total:{" "}
                  {Memory ? (Memory.totalmemory / 1024 ** 3).toFixed(1) : 0} GB
                </p>
                <p className="text-pink-400">
                  Used:{" "}
                  {Memory ? (Memory.usedmemory / 1024 ** 3).toFixed(1) : 0} GB
                </p>
                <p className="text-green-400">
                  Free:{" "}
                  {Memory ? (Memory.freememory / 1024 ** 3).toFixed(1) : 0} GB
                </p>
              </>
            }
          />

          <ChartBox
            title="Disk Info"
            percent={Disk?.storagePercent?.replace("%", "") || 0}
            color="#facc15"
            details={
              <>
                <p className="text-yellow-400">
                  Used: {Disk?.usedGB || "0 GB"} / {Disk?.totalGB || "0 GB"}
                </p>
                <p className="text-blue-400">Type: {Disk?.type || "Unknown"}</p>
                <p className="text-green-400">
                  System Disk: {Disk?.type || "No"}
                </p>
              </>
            }
          />

          <ChartBox
            title="GPU Info"
            percent={GPU?.usagePercent.toFixed(2) || 0}
            color="#fb7185"
            details={
              <>
                <p className="text-pink-400">Model: {GPU?.model}</p>
                <p className="text-blue-400">Vendor: {GPU?.vendor}</p>
                <p className="text-green-400">
                  Memory: {GPU?.memory?.dedicated}
                </p>
              </>
            }
          />
        </div>
      </div>
    </div>
  );
};

const ChartBox = ({ title, percent, color, details }) => (
  <div className="text-center bg-gray-800 p-6 rounded-2xl h-[425px] shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
    <div className="w-64 h-64 mx-auto">
      <CircularProgressbar
        value={percent}
        text={`${percent}%`}
        styles={buildStyles({
          pathColor: color,
          textColor: "#fff",
          trailColor: "#374151",
          textSize: "16px",
        })}
      />
    </div>
    <h1 className="mt-4 font-bold text-xl text-white">{title}</h1>
    <div className="mt-2 text-sm text-gray-300 space-y-1">{details}</div>
  </div>
);

export default Main;
