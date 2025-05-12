import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./Pages/Main";
import Processes from "./Pages/Processes";
import Memory from "./Pages/Memory";
import CPU from "./Pages/CPU";
import Disk from "./Pages/Disk";
import GPU from "./Pages/GPU";
import Navbar from "./Components/Navbar";

export default function App() {
  return (

    
    <BrowserRouter>
    
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="Processes" element={<Processes />} />
        <Route path="CPU" element={<CPU />} />
        <Route path="Memory" element={<Memory />} />
        <Route path="Disk" element={<Disk />} />
        <Route path="GPU" element={<GPU />} />
      </Routes>
    </BrowserRouter>
  );
}
