// src/App.jsx
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import CurrentDay from "./pages/CurrentDay";
import Historical from "./pages/Historical";
import { useGPS } from "./hooks/useGPS";

export default function App() {
  const [activePage, setActivePage] = useState("current");
  const { coords, loading: gpsLoading } = useGPS();

  if (gpsLoading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="text-slate-400 text-lg animate-pulse">Detecting your location...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Navbar activePage={activePage} setActivePage={setActivePage}/>
      {activePage === "current"
        ? <CurrentDay coords={coords}/>
        : <Historical coords={coords}/>
      }
    </div>
  );
}