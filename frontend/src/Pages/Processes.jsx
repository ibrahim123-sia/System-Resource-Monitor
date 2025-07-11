import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";

const Processes = () => {
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  const fetchProcessInfo = async () => {
    try {
      const res = await axios.get("/api/ProcessInfo");
      setProcesses(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching process info:", err);
      setError("Failed to fetch process data.");
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  fetchProcessInfo();
  const interval = setInterval(fetchProcessInfo, 1000);
  return () => clearInterval(interval);
}, []);


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Navbar />
       <div className="flex justify-center mt-[200px] "><p className="text-lg text-green-500"> Loading...</p></div>
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
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6 text-white">Running Processes</h2>

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-3 px-6 text-left text-gray-300 uppercase text-sm">PID</th>
                <th className="py-3 px-6 text-left text-gray-300 uppercase text-sm">Name</th>
                <th className="py-3 px-6 text-left text-gray-300 uppercase text-sm">CPU %</th>
                <th className="py-3 px-6 text-left text-gray-300 uppercase text-sm">Memory %</th>
                <th className="py-3 px-6 text-left text-gray-300 uppercase text-sm">Power Usage</th>
                <th className="py-3 px-6 text-left text-gray-300 uppercase text-sm">Threads</th>
                <th className="py-3 px-6 text-left text-gray-300 uppercase text-sm">Priority</th>
                <th className="py-3 px-6 text-left text-gray-300 uppercase text-sm">User</th>
                <th className="py-3 px-6 text-left text-gray-300 uppercase text-sm">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {processes.map((proc) => (
                <tr
                  key={proc.pid}
                  className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
                >
                  <td className="py-3 px-6">{proc.pid}</td>
                  <td className="py-3 px-6">{proc.name}</td>

                  <td
                    className={`py-3 px-6 ${
                      proc.cpu > 50
                        ? "text-red-500"
                        : proc.cpu > 20
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}
                  >
                    {proc.cpu.toFixed(1)}%
                  </td>

                  <td
                    className={`py-3 px-6 ${
                      proc.mem > 50
                        ? "text-red-500"
                        : proc.mem > 20
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}
                  >
                    {proc.mem.toFixed(1)}%
                  </td>

                  <td
                    className={`py-3 px-6 ${
                      proc.power === "High"
                        ? "text-red-500"
                        : proc.power === "Moderate"
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}
                  >
                    {proc.power}
                  </td>

                  <td className="py-3 px-6">{proc.threads}</td>
                  <td className="py-3 px-6">{proc.priority}</td>
                  <td className="py-3 px-6">{proc.user}</td>

                  <td className="py-3 px-6">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        proc.status === "running"
                          ? "bg-green-500/20 text-green-400"
                          : proc.status === "sleeping"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {proc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Processes;
