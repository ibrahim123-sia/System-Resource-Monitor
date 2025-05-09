const express =require("express"); 
const si=require("systeminformation");
const cors=require("cors")

const app=express()
app.use(cors())
const port=5000


app.get("/ProcessInfo", async (req, res) => {
  try {
    const data = await si.processes();

    const processList = data.list.map((p) => ({
      pid: p.pid,
      name: p.name,
      cpu: p.cpu,
      mem: p.mem,
      power: getPowerUsage(p.cpu),
    }));

    processList.sort((a, b) => b.cpu - a.cpu);

    res.json(processList.slice(0, 20));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error getting processes");
  }
});


function getPowerUsage(cpu) {
  if (cpu > 50) return "High";
  if (cpu > 20) return "Moderate";
  return "Low";
}


app.get("/CPUInfo",async(req,res)=>{

    try {
        const processes=await si.processes();
        const cpuInfo = await si.cpu();
        const cpuSpeed = await si.cpuCurrentSpeed();
        const cpuLoad = await si.currentLoad();
        const cpuTemp = await si.cpuTemperature();
        const cpuFlags = await si.cpuFlags();
     
    
        res.json({
            manufacturer: cpuInfo.manufacturer,
            brand: cpuInfo.brand,
            socket: cpuInfo.socket,
            baseSpeedGHz: cpuInfo.speed,
            minSpeedGHz: cpuInfo.speedMin,
            maxSpeedGHz: cpuInfo.speedMax,
            physicalCores: cpuInfo.physicalCores,
            logicalCores: cpuInfo.cores,
            processors: cpuInfo.processors,
            cache: cpuInfo.cache,
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
              idlePercent: cpuLoad.currentLoadIdle,
              perCoreLoadPercent: cpuLoad.cpus.map((core) => core.load),
            },
            temperature: {
              mainCelsius: cpuTemp.main,
              perCoreCelsius: cpuTemp.cores,
              maxCelsius: cpuTemp.max,
            },
            flags: cpuFlags,
          });

    }
    catch(error){
        console.error(error)
        res.status(500).json({error:"fail to get cpu info"})
    }
      
})

app.get("/MemoryInfo",async(req,res)=>{

    try{
        
        const MemoryInfo =await si.mem()
        const MemoryLayoutInfo = await si.memLayout();
             

        res.json({
            totalmemory: MemoryInfo.total,
            freememory: MemoryInfo.free,
            usedmemory: MemoryInfo.used,
            MemoryLayoutInfo,
            
        })
    }

    catch(error){
        console.error(error)
        res.status(500).json({error:"fail to get memory info"})
    }
})

app.get("/GpuInfo",async(req,res)=>{

    try {
        const gpuData = await si.graphics();
        res.json({
          controllers: gpuData.controllers,
          displays: gpuData.displays
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get GPU info" });
      }
})

app.get("/DiskInfo", async (req, res) => {
    try {
      const diskLayout = await si.diskLayout(); 
      const diskUsage = await si.fsSize();      
  
      
      const diskInfo = diskLayout[0];
  
      const total = diskUsage.reduce((acc, d) => acc + d.size, 0);
      const used = diskUsage.reduce((acc, d) => acc + d.used, 0);
  
      res.json({
        model: diskInfo.name,
        type: diskInfo.type,   
        totalGB: (total / (1024 ** 3)).toFixed(2) + " GB",
        usedGB: (used / (1024 ** 3)).toFixed(2) + " GB"
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to get disk info" });
    }
  });
  
  

app.listen(port,()=>{
    console.log("Server running on port 3000");
})
