// src/components/Charts/HourlyCharts.jsx
import React, { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Brush
} from "recharts";

const COLORS = {
  temp: "#f97316",
  humidity: "#38bdf8",
  precip: "#818cf8",
  visibility: "#34d399",
  wind: "#fb923c",
  pm10: "#f472b6",
  pm25: "#a78bfa",
};

function ChartCard({ title, children }) {
  return (
    <div className="bg-[#1e293b] rounded-xl p-4 border border-white/5">
      <h3 className="text-slate-300 text-sm font-medium mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <div style={{ minWidth: 600 }}>{children}</div>
      </div>
    </div>
  );
}

export default function HourlyCharts({ hourlyData, selectedDate }) {
  const [tempUnit, setTempUnit] = useState("C");

  if (!hourlyData) return null;

  // Filter to selected date only
  const times = hourlyData.time || [];
  const dateStr = selectedDate?.toISOString().split("T")[0] || new Date().toISOString().split("T")[0];
  
  const indices = times.reduce((acc, t, i) => {
    if (t.startsWith(dateStr)) acc.push(i);
    return acc;
  }, []);

  const toF = (c) => (c * 9/5 + 32).toFixed(1);
  const getTemp = (c) => tempUnit === "C" ? c?.toFixed(1) : toF(c);

  const chartData = indices.map((i) => ({
    time: times[i]?.slice(11, 16),
    temp: getTemp(hourlyData.temperature_2m?.[i]),
    humidity: hourlyData.relativehumidity_2m?.[i],
    precip: hourlyData.precipitation?.[i],
    visibility: ((hourlyData.visibility?.[i] || 0) / 1000).toFixed(1),
    wind: hourlyData.windspeed_10m?.[i],
    pm10: hourlyData.pm10?.[i],
    pm25: hourlyData.pm2_5?.[i],
  }));

  const tooltipStyle = {
    backgroundColor: "#0f172a",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    color: "#f8fafc",
  };

  return (
    <div className="space-y-4">
      {/* Temperature Chart */}
      <ChartCard title={`🌡️ Temperature (°${tempUnit})`}>
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setTempUnit(tempUnit === "C" ? "F" : "C")}
            className="text-xs bg-white/10 text-white px-3 py-1 rounded-full hover:bg-white/20"
          >
            Switch to °{tempUnit === "C" ? "F" : "C"}
          </button>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.temp} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={COLORS.temp} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }}/>
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }}/>
            <Tooltip contentStyle={tooltipStyle}/>
            <Brush dataKey="time" height={20} stroke="#334155" fill="#0f172a"/>
            <Area type="monotone" dataKey="temp" stroke={COLORS.temp} fill="url(#tempGrad)" strokeWidth={2}/>
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Humidity */}
      <ChartCard title="💧 Relative Humidity (%)">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }}/>
            <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }}/>
            <Tooltip contentStyle={tooltipStyle}/>
            <Brush dataKey="time" height={20} stroke="#334155" fill="#0f172a"/>
            <Line type="monotone" dataKey="humidity" stroke={COLORS.humidity} strokeWidth={2} dot={false}/>
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Precipitation */}
      <ChartCard title="🌧️ Precipitation (mm)">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }}/>
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }}/>
            <Tooltip contentStyle={tooltipStyle}/>
            <Brush dataKey="time" height={20} stroke="#334155" fill="#0f172a"/>
            <Bar dataKey="precip" fill={COLORS.precip} radius={[3, 3, 0, 0]}/>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Visibility */}
      <ChartCard title="👁️ Visibility (km)">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }}/>
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }}/>
            <Tooltip contentStyle={tooltipStyle}/>
            <Brush dataKey="time" height={20} stroke="#334155" fill="#0f172a"/>
            <Line type="monotone" dataKey="visibility" stroke={COLORS.visibility} strokeWidth={2} dot={false}/>
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Wind Speed */}
      <ChartCard title="💨 Wind Speed at 10m (km/h)">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.wind} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={COLORS.wind} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }}/>
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }}/>
            <Tooltip contentStyle={tooltipStyle}/>
            <Brush dataKey="time" height={20} stroke="#334155" fill="#0f172a"/>
            <Area type="monotone" dataKey="wind" stroke={COLORS.wind} fill="url(#windGrad)" strokeWidth={2}/>
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* PM10 + PM2.5 combined */}
      <ChartCard title="🏭 Air Particles — PM10 & PM2.5 (μg/m³)">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }}/>
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }}/>
            <Tooltip contentStyle={tooltipStyle}/>
            <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 12 }}/>
            <Brush dataKey="time" height={20} stroke="#334155" fill="#0f172a"/>
            <Line type="monotone" dataKey="pm10" stroke={COLORS.pm10} strokeWidth={2} dot={false} name="PM10"/>
            <Line type="monotone" dataKey="pm25" stroke={COLORS.pm25} strokeWidth={2} dot={false} name="PM2.5"/>
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}