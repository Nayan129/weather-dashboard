// src/pages/Historical.jsx
import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from "recharts";
import { fetchHistoricalWeather } from "../api/weather";
import { format, subYears } from "date-fns";

const tooltipStyle = {
  backgroundColor: "#0f172a",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  color: "#f8fafc",
  fontSize: 12,
};

function ChartCard({ title, children }) {
  return (
    <div className="bg-[#1e293b] rounded-xl p-4 border border-white/5">
      <h3 className="text-slate-300 text-sm font-medium mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <div style={{ minWidth: 700 }}>{children}</div>
      </div>
    </div>
  );
}

export default function Historical({ coords }) {
  const today = new Date();
  const [startDate, setStartDate] = useState(
    format(subYears(today, 1), "yyyy-MM-dd"),
  );
  const [endDate, setEndDate] = useState(format(today, "yyyy-MM-dd"));
  const [histData, setHistData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const maxStart = format(subYears(new Date(endDate), 2), "yyyy-MM-dd");

  const loadData = async () => {
    if (!coords) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchHistoricalWeather(
        coords.lat,
        coords.lon,
        startDate,
        endDate,
      );
      setHistData(res);
    } catch (e) {
      setError("Failed to load historical data.");
    } finally {
      setLoading(false);
    }
  };

  const daily = histData?.weather?.daily;

  const chartData =
    daily?.time?.map((date, i) => ({
      date,
      tempMax: daily.temperature_2m_max?.[i],
      tempMin: daily.temperature_2m_min?.[i],
      tempMean: daily.temperature_2m_mean?.[i],
      sunrise: daily.sunrise?.[i]?.slice(11, 16),
      sunset: daily.sunset?.[i]?.slice(11, 16),
      precip: daily.precipitation_sum?.[i],
      windMax: daily.windspeed_10m_max?.[i],
      windDir: daily.winddirection_10m_dominant?.[i],
      pm10: daily.pm10?.[i],
      pm25: daily.pm2_5?.[i],
    })) || [];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <h2 className="text-white font-semibold text-xl">📅 Historical Data</h2>

      {/* Date Range Picker */}
      <div className="bg-[#1e293b] rounded-xl p-4 border border-white/5">
        <p className="text-slate-400 text-sm mb-3">
          Select date range (max 2 years)
        </p>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
          <div>
            <label className="text-xs text-slate-500 block mb-1">From</label>
            <input
              type="date"
              value={startDate}
              min={maxStart}
              max={endDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-[#0f172a] text-white border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">To</label>
            <input
              type="date"
              value={endDate}
              max={format(today, "yyyy-MM-dd")}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-[#0f172a] text-white border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={loadData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all"
          >
            {loading ? "Loading..." : "Fetch Data"}
          </button>
        </div>
      </div>

      {error && <p className="text-red-400">{error}</p>}

      {chartData.length > 0 && (
        <div className="space-y-4">
          {/* Temperature */}
          <ChartCard title="🌡️ Temperature — Max, Min, Mean (°C)">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  tick={{ fontSize: 10 }}
                  interval={Math.floor(chartData.length / 10)}
                />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 12 }} />
                <Brush
                  dataKey="date"
                  height={20}
                  stroke="#334155"
                  fill="#0f172a"
                />
                <Line
                  type="monotone"
                  dataKey="tempMax"
                  stroke="#f97316"
                  strokeWidth={1.5}
                  dot={false}
                  name="Max"
                />
                <Line
                  type="monotone"
                  dataKey="tempMean"
                  stroke="#facc15"
                  strokeWidth={1.5}
                  dot={false}
                  name="Mean"
                />
                <Line
                  type="monotone"
                  dataKey="tempMin"
                  stroke="#38bdf8"
                  strokeWidth={1.5}
                  dot={false}
                  name="Min"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Precipitation */}
          <ChartCard title="🌧️ Precipitation (mm)">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  tick={{ fontSize: 10 }}
                  interval={Math.floor(chartData.length / 10)}
                />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Brush
                  dataKey="date"
                  height={20}
                  stroke="#334155"
                  fill="#0f172a"
                />
                <Bar
                  dataKey="precip"
                  fill="#818cf8"
                  radius={[2, 2, 0, 0]}
                  name="Precipitation"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Wind speed*/}
          <ChartCard title="💨 Max Wind Speed (km/h)">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  tick={{ fontSize: 10 }}
                  interval={Math.floor(chartData.length / 10)}
                />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Brush
                  dataKey="date"
                  height={20}
                  stroke="#334155"
                  fill="#0f172a"
                />
                <Line
                  type="monotone"
                  dataKey="windMax"
                  stroke="#fb923c"
                  strokeWidth={1.5}
                  dot={false}
                  name="Max Wind"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* PM10 + PM2.5 */}
          <ChartCard title="🏭 PM10 & PM2.5 (μg/m³)">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  tick={{ fontSize: 10 }}
                  interval={Math.floor(chartData.length / 10)}
                />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 12 }} />
                <Brush
                  dataKey="date"
                  height={20}
                  stroke="#334155"
                  fill="#0f172a"
                />
                <Line
                  type="monotone"
                  dataKey="pm10"
                  stroke="#f472b6"
                  strokeWidth={1.5}
                  dot={false}
                  name="PM10"
                />
                <Line
                  type="monotone"
                  dataKey="pm25"
                  stroke="#a78bfa"
                  strokeWidth={1.5}
                  dot={false}
                  name="PM2.5"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}
    </div>
  );
}
