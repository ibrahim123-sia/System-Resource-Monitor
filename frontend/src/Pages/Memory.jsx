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

const Memory = () => {
  const [memoryData, setMemoryData] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchMemoryInfo = async () => {
    try {
      const res = await axios.get('/api/MemoryInfo')
      const newData = {
        used: (res.data.usedmemory / 1024 ** 3).toFixed(1),
        total: (res.data.totalmemory / 1024 ** 3).toFixed(1),
        free: (res.data.freememory / 1024 ** 3).toFixed(1),
        time: new Date().toLocaleTimeString(),
      }
      
      setHistory(prev => [...prev.slice(-14), newData]) 
      setMemoryData(res.data)
      setError(null)
    } catch (err) {
      
      setError('Failed to fetch memory data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMemoryInfo()
    const interval = setInterval(fetchMemoryInfo, 1000)
    return () => clearInterval(interval)
  }, [])

  const chartData = {
    labels: history.map(data => data.time),
    datasets: [
      {
        label: 'Memory Usage (GB)',
        data: history.map(data => data.used),
        borderColor: '#60a5fa',
        backgroundColor: 'rgba(96, 165, 250, 0.2)',
        tension: 0.4,
      },
    ],
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Navbar />
       <div className="flex justify-center mt-[200px] "><p className="text-xl text-green-500"> Loading...</p></div>
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
        <h1 className="text-3xl font-bold text-white mb-8">Memory Information</h1>
        
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
                    x: { ticks: { color: '#9ca3af' },
                        title:{text:'Time',display:true,color:'#9ca3af'} },
                    y: { 
                      ticks: { color: '#9ca3af' },
                      title: { text: 'GB', display: true, color: '#9ca3af' }
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
                <h3 className="text-blue-400 font-medium">Total Memory</h3>
                <p className="text-2xl text-white">
                  {(memoryData.totalmemory / 1024 ** 3).toFixed(1)} GB
                </p>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-blue-400 font-medium">Used Memory</h3>
                <p className="text-2xl text-white">
                  {(memoryData.usedmemory / 1024 ** 3).toFixed(1)} GB
                </p>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-blue-400 font-medium">Free Memory</h3>
                <p className="text-2xl text-white">
                  {(memoryData.freememory / 1024 ** 3).toFixed(1)} GB
                </p>
              </div>
            </div>
          </div>

         
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Memory Layout</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {memoryData.MemoryLayoutInfo?.map((stick, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-blue-400 font-medium">Stick {index + 1}</h3>
                  <div className="space-y-2 mt-2">
                    <p className="text-white">
                      Size: {(stick.size / 1024 ** 3).toFixed(1)} GB
                    </p>
                    <p className="text-white">Type: {stick.type}</p>
                    <p className="text-white">Clock Speed: {stick.clockSpeed} MHz</p>
                    <p className="text-white">Form Factor: {stick.formFactor}</p>
                    <p className="text-white">Slot Used: {memoryData.slots}/2</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Memory