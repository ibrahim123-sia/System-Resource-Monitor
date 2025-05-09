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

  const fetchProcessInfo = async () => {
    const res = await axios.get("http://localhost:5000/ProcessInfo");
    setProcesses(res.data);
  };

  const fetchCPUInfo = async () => {
    const res = await axios.get("http://localhost:5000/CPUInfo");
    setCPU(res.data);
  };

  const fetchMemoryInfo = async () => {
    const res = await axios.get("http://localhost:5000/MemoryInfo");
    setMemory(res.data);
  };

  const fetchDiskInfo = async () => {
    const res = await axios.get("http://localhost:5000/DiskInfo");
    setDisk(res.data);
  };

  const fetchGPUInfo = async () => {
    const res = await axios.get("http://localhost:5000/GPUInfo");
    setGPU(res.data);
  };

  useEffect(() => {
    fetchProcessInfo();
    fetchCPUInfo();
    fetchMemoryInfo();
    fetchDiskInfo();
    fetchGPUInfo();

    const interval = setInterval(() => {
      fetchProcessInfo();
      fetchCPUInfo();
      fetchMemoryInfo();
      fetchDiskInfo();
      fetchGPUInfo();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getMemoryPercent = () =>
    Memory ? ((Memory.usedmemory / Memory.totalmemory) * 100).toFixed(1) : 0;

  const getDiskPercent = () => {
    if (Disk) {
      const usedGB = parseFloat(Disk.usedGB);
      const totalGB = parseFloat(Disk.totalGB);
      return ((usedGB / totalGB) * 100).toFixed(1);
    }
    return 0;
  };

  return (
    <div className="bg-gray-900">
      <Navbar />

      <div className="p-10 flex gap-10 flex-wrap justify-center">
        
        <div className="w-[550px]">
          <table className="w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-700 text-gray-300 uppercase text-lg leading-normal">
                <th className="py-2 px-6 text-left">PID</th>
                <th className="py-2 px-6 text-left">Process</th>
                <th className="py-2 px-6 text-left">CPU</th>
                <th className="py-2 px-6 text-left">Memory</th>
                <th className="py-2 px-6 text-left">Power</th>
              </tr>
            </thead>
            <tbody className="text-gray-300 text-[16px] font-light">
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

        
        <div className="grid grid-cols-2 gap-10">
          
          <ChartBox
            title="CPU Load"
            percent={CPU?.load?.totalLoadPercent?.toFixed(1) || 0}
            color="#4ade80"
            details={
              <>
                <p>Total Load: {CPU?.load?.totalLoadPercent?.toFixed(1)}%</p>
                <p>User Load: {CPU?.load?.userLoadPercent?.toFixed(1)}%</p>
                <p>Speed: {CPU?.baseSpeedGHz} GHz</p>
                <p>Processes: {CPU?.totalprocess ?? 'Loading...'}</p>
              </>
            }
          />

          
          <ChartBox
            title="Memory Usage"
            percent={getMemoryPercent()}
            color="#60a5fa"
            details={
              <>
                <p>
                  Used:{" "}
                  {Memory ? (Memory.usedmemory / 1024 ** 3).toFixed(1) : 0} GB
                </p>
                <p>
                  Total:{" "}
                  {Memory ? (Memory.totalmemory / 1024 ** 3).toFixed(1) : 0} GB
                </p>
              </>
            }
          />

          
          <ChartBox
            title="Disk Usage"
            percent={getDiskPercent()}
            color="#facc15"
            details={
              <>
                <p>Used: {Disk?.usedGB} GB</p>
                <p>Total: {Disk?.totalGB} GB</p>
              </>
            }
          />

         
          <ChartBox
            title="GPU Info"
            percent={50} 
            color="#fb7185"
            details={
              <>
                <p>Model: {GPU?.controllers?.[0]?.model}</p>
                <p>Vendor: {GPU?.controllers?.[0]?.vendor}</p>
                <p>Memory: {GPU?.controllers?.[0]?.memoryTotal} MB</p>
              </>
            }
          />
        </div>
      </div>
    </div>
  );
};


const ChartBox = ({ title, percent, color, details }) => (
  <div className="text-center bg-gray-800 p-6 rounded-2xl shadow-lg">
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
    <h1 className="mt-4 font-bold text-xl text-white ">{title}</h1>
    <div className="mt-2 text-sm text-gray-300">{details}</div>
  </div>
);

export default Main;
