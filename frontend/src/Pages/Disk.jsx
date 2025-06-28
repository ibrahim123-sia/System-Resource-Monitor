import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../Components/Navbar'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const Disk = () => {
  const [diskData, setDiskData] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDiskInfo = async () => {
    try {
      const res = await axios.get('/api/DiskInfo')
      const newData = {
        percent: parseFloat(res.data.storagePercent),
        used: parseFloat(res.data.usedGB),
        total: parseFloat(res.data.capacity),
        time: new Date().toLocaleTimeString(),
      }
      
      setHistory(prev => [...prev.slice(-9), newData]) 
      setDiskData(res.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching disk info:', err)
      setError('Failed to fetch disk data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDiskInfo()
    const interval = setInterval(fetchDiskInfo, 2000)
    return () => clearInterval(interval)
  }, [])

  const chartData = {
    labels: history.map(data => data.time),
    datasets: [
      {
        label: 'Disk Usage (%)',
        data: history.map(data => data.percent),
        borderColor: '#facc15',
        backgroundColor: 'rgba(250, 204, 21, 0.2)',
        tension: 0.4,
      },
    ],
  }

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
    )
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Disk Information</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Usage History</h2>
            <div className="h-80">
              <Line 
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { labels: { color: '#fff' } }
                  },
                  scales: {
                    x: { ticks: { color: '#9ca3af' } },
                    y: { 
                      min: 0,
                      max: 100,
                      ticks: { color: '#9ca3af' },
                      title: { text: 'Percentage', display: true, color: '#9ca3af' }
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Current Usage</h2>
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-yellow-400 font-medium">Total Capacity</h3>
                <p className="text-2xl text-white">
                  {diskData.capacity}
                </p>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-yellow-400 font-medium">Used Space</h3>
                <p className="text-2xl text-white">
                  {diskData.usedGB} GB
                </p>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-yellow-400 font-medium">Usage Percentage</h3>
                <p className="text-2xl text-white">
                  {diskData.storagePercent}
                </p>
              </div>
            </div>
          </div>

         
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Storage Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-yellow-400 font-medium">Disk Type</h3>
                <p className="text-white text-lg">{diskData.type}</p>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-yellow-400 font-medium">Available Space</h3>
                <p className="text-white text-lg">
                  {(parseFloat(diskData.capacity) - parseFloat(diskData.usedGB)).toFixed(1)} GB
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Disk