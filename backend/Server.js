const express =require("express"); 
const si=require("systeminformation");
const cors=require("cors")

const app=express()
app.use(cors())
const port = process.env.PORT || 5000;


app.get("/ProcessInfo", async (req, res) => {
  try {
    const data = await si.processes();

    const processList = data.list.map((p) => ({
      pid: p.pid,
      name: p.name,
      cpu: p.cpu || 0,
      mem: p.mem || 0,
      power: getPowerUsage(p.cpu),
      threads: p.threads || 'N/A', 
      priority: p.priority ?? 'N/A',
      status: p.state ? p.state.toLowerCase() : 'unknown',
      user:"System"
    }));

    processList.sort((a, b) => b.cpu - a.cpu);

    res.json(processList.slice(0, 20));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error getting processes");
  }
});

function getPowerUsage(cpu) {
  if (typeof cpu !== 'number') return 'N/A';
  
  if (cpu > 50) return "High";
  if (cpu > 20) return "Moderate";
  return "Low";
}

app.get("/CPUInfo", async (req, res) => {
  try {
    const processes = await si.processes();
    const cpuInfo = await si.cpu();
    const cpuSpeed = await si.cpuCurrentSpeed();
    const cpuLoad = await si.currentLoad();
       
    const historicalData = {
      timestamp: new Date().getTime(),  
      utilization: cpuLoad.currentLoad, 
    };

    res.json({
      manufacturer: cpuInfo.manufacturer,
      brand: cpuInfo.brand,
      baseSpeedGHz: cpuInfo.speed,
      minSpeedGHz: cpuInfo.speedMin,
      maxSpeedGHz: cpuInfo.speedMax,
      physicalCores: cpuInfo.physicalCores,
      logicalCores: cpuInfo.cores,
      processors: cpuInfo.processors,
      cache3: (cpuInfo.cache.l3 / (1024 * 1024)).toFixed(2),
      cache2: (cpuInfo.cache.l2 /1024).toFixed(2),
      totalprocess: processes.all,
      currentSpeed: {
        minGHz: cpuSpeed.min,
        maxGHz: cpuSpeed.max,
        avgGHz: cpuSpeed.avg,
        perCoreGHz: cpuSpeed.cores,
      },
      load: {
        totalLoadPercent: cpuLoad.currentLoad,
        userLoadPercent: cpuLoad.currentLoadUser,
        systemLoadPercent: cpuLoad.currentLoadSystem,
      },
     
      historicalData: [historicalData] 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get CPU info" });
  }
});


app.get("/MemoryInfo",async(req,res)=>{

    try{  
        const MemoryInfo =await si.mem()
        const MemoryLayoutInfo = await si.memLayout();
            
        res.json({
            totalmemory: MemoryInfo.total,
            freememory: MemoryInfo.free,
            usedmemory: MemoryInfo.used,
            MemoryLayoutInfo,
            slots:MemoryLayoutInfo.length
              
        })
    }

    catch(error){
        console.error(error)
        res.status(500).json({error:"fail to get memory info"})
    }
})


app.get("/GpuInfo", async (req, res) => {
  try {
    const gpuData = await si.graphics();
    const gpuController = gpuData.controllers[0];

    if (!gpuController) {
      return res.status(404).json({ error: 'No GPU controller found' });
    }

    
    const formatMemory = (mb) => (mb / 1024).toFixed(1);
    const totalMemory = formatMemory(gpuController.memoryTotal || 3.9 * 1024);
    const usedMemory = formatMemory(gpuController.memoryUsed || 0.2 * 1024);
    const usagePercent=(usedMemory/totalMemory)*100

    res.json({
      usedMemory:`${usedMemory} GB`,
      usagePercent,
      model: gpuController.model,
      vendor: gpuController.vendor,
      utilization: `${gpuController.utilizationGpu || 0}%`,
      memory: {
        dedicated: `${usedMemory}/${totalMemory} GB`,
        shared: `${usedMemory}/${totalMemory} GB` 
      },
      driverVersion: gpuController.driverVersion,
      driverDate: gpuController.driverDate,
      directXVersion: gpuController.directXVersion || '12 (FL 12.1)',
      physicalLocation: gpuController.bus || 'PCI bus 0, device 2, function 0'
    });
  } catch (error) {
    console.error("GPU Info Error:", error);
    res.status(500).json({ error: "Failed to get GPU info" });
  }
});



app.get("/DiskInfo", async (req, res) => {
  try {
    const [diskLayout, diskUsage] = await Promise.all([si.diskLayout(), si.fsSize()]);
    const cDrive = diskUsage.find(d => d.mount.toLowerCase() === 'c:' || d.mount === '/' || d.mount === '/mnt/c') || { size: 0, used: 0 };

    const usedGB = (cDrive.used / (1024 ** 3)).toFixed(1);
    const totalGB = (cDrive.size / (1024 ** 3)).toFixed(1);
    const storagePercent = cDrive.size ? ((cDrive.used / cDrive.size) * 100).toFixed(1) : '0';
    const free=totalGB-usedGB;

    res.json({
      free,
      usedGB,
      capacity:totalGB,
      storagePercent: `${storagePercent}%`,
      type: diskLayout[0]?.type || 'Unknown',
    });
  } catch (error) {
    console.error("Disk Error:", error);
  }
});

app.listen(port,()=>{
    console.log("Server running on ",port);
})

