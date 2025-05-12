import React, { useEffect, useState } from 'react';
import axios from "axios";
import Navbar from '../Components/Navbar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CPU = () => {
  const [cpuData, setCpuData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCPU = async () => {
    try {
      const res = await axios.get("http://localhost:5000/CPUInfo");
      const responseData = res.data;

      setCpuData(res.data); 

      setChartData(prev => {
        const newData = [...prev, {
          second: prev.length + 1,
          utilization: responseData.load.totalLoadPercent
        }];
        return newData.slice(-60);
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching CPU data:", error);
      setError("Failed to fetch CPU data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCPU();
    const interval = setInterval(fetchCPU, 1000);
    return () => clearInterval(interval);
  }, []);

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
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="p-8 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />

      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4 text-white">CPU Performance</h2>

        <div className="bg-gray-800 p-4 rounded-2xl shadow-lg mb-6" style={{ height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="second"
                stroke="#9CA3AF"
                label={{
                  value: 'Seconds',
                  position: 'bottom',
                  fill: '#D1D5DB'
                }}
              />
              <YAxis
                stroke="#9CA3AF"
                label={{
                  value: 'Utilization %',
                  angle: -90,
                  position: 'insideLeft',
                  fill: '#D1D5DB'
                }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                itemStyle={{ color: '#E5E7EB' }}
              />
              <Line
                type="monotone"
                dataKey="utilization"
                stroke="#4ade80"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-white">Performance</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-white">Utilization</span>
                <span className="text-white font-medium">
                  {cpuData.historicalData[0]?.utilization?.toFixed(1) || 'N/A'}%
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-white">Current Speed</span>
                <span className="text-white font-medium">{cpuData.currentSpeed?.maxGHz.toFixed(1) || 'N/A'} GHz</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-white">Base Speed</span>
                <span className="text-white font-medium">{cpuData.baseSpeedGHz?.toFixed(1) || 'N/A'} GHz</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-white">Processes</span>
                <span className="text-white font-medium">{cpuData.totalprocess || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-white">System Load</span>
                <span className="text-white font-medium">{cpuData?.load?.systemLoadPercent?.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-white">User Load</span>
                <span className="text-white font-medium">{cpuData?.load?.userLoadPercent?.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-white">Specifications</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-white">Manufacturer</span>
                <span className="text-white font-medium">{cpuData.manufacturer || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-white">Brand</span>
                <span className="text-white font-medium">{cpuData.brand || 'N/A'}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-white">Cores</span>
                <span className="text-white font-medium">{cpuData.physicalCores || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-white">Logical Processors</span>
                <span className="text-white font-medium">{cpuData.logicalCores || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-white">L3 Cache</span>
                <span className="text-white font-medium">{cpuData.cache3} MB</span>

              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-white">L2 Cache</span>
                <span className="text-white font-medium">{cpuData.cache2} KB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CPU;
