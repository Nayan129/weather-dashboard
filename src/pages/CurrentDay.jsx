
import React, { useState } from "react";
import WeatherCard from "../components/WeatherCard";
import HourlyCharts from "../components/Charts/HourlyCharts";
import { useWeather } from "../hooks/useWeather";
import { format } from "date-fns";

export default function CurrentDay({ coords }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { data, loading, error } = useWeather(coords, selectedDate);

  const daily = data?.weather?.daily;
  const hourly = data?.weather?.hourly;
  const current = data?.weather?.current_weather;
  const aqiHourly = data?.aqi?.hourly;

  // Get today's index in aqi hourly
  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const aqiIdx = aqiHourly?.time?.findIndex((t) => t.startsWith(dateStr)) ?? -1;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-slate-400 animate-pulse">Loading weather data...</div>
    </div>
  );

  if (error) return (
    <div className="text-red-400 p-6">Failed to load weather. Check API or GPS.</div>
  );

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Date picker */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <h2 className="text-white font-semibold text-xl flex items-center gap-2">
          📍 Weather Today
        </h2>
        <input
          type="date"
          value={format(selectedDate, "yyyy-MM-dd")}
          max={format(new Date(), "yyyy-MM-dd")}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="bg-[#1e293b] text-white border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <WeatherCard label="Current Temp" value={current?.temperature} unit="°C" icon="🌡️"/>
        <WeatherCard label="Max Temp" value={daily?.temperature_2m_max?.[0]} unit="°C" icon="🔥"/>
        <WeatherCard label="Min Temp" value={daily?.temperature_2m_min?.[0]} unit="°C" icon="❄️"/>
        <WeatherCard label="Precipitation" value={daily?.precipitation_sum?.[0]} unit="mm" icon="🌧️"/>
        <WeatherCard label="Humidity" value={hourly?.relativehumidity_2m?.[0]} unit="%" icon="💧"/>
        <WeatherCard label="UV Index" value={daily?.uv_index_max?.[0]} icon="☀️"/>
        <WeatherCard label="Sunrise" value={daily?.sunrise?.[0]?.slice(11, 16)} icon="🌅"/>
        <WeatherCard label="Sunset" value={daily?.sunset?.[0]?.slice(11, 16)} icon="🌇"/>
        <WeatherCard label="Max Wind" value={daily?.windspeed_10m_max?.[0]} unit="km/h" icon="💨"/>
        <WeatherCard label="Precip Prob Max" value={daily?.precipitation_probability_max?.[0]} unit="%" icon="🌂"/>
      </div>

      {/* Air Quality */}
      <div>
        <h3 className="text-slate-300 font-medium mb-3">🏭 Air Quality</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <WeatherCard label="PM2.5" value={aqiIdx >= 0 ? aqiHourly?.pm2_5?.[aqiIdx]?.toFixed(1) : "--"} unit="μg/m³"/>
          <WeatherCard label="PM10" value={aqiIdx >= 0 ? aqiHourly?.pm10?.[aqiIdx]?.toFixed(1) : "--"} unit="μg/m³"/>
          <WeatherCard label="CO" value={aqiIdx >= 0 ? aqiHourly?.carbon_monoxide?.[aqiIdx]?.toFixed(0) : "--"} unit="μg/m³"/>
          <WeatherCard label="NO₂" value={aqiIdx >= 0 ? aqiHourly?.nitrogen_dioxide?.[aqiIdx]?.toFixed(1) : "--"} unit="μg/m³"/>
          <WeatherCard label="SO₂" value={aqiIdx >= 0 ? aqiHourly?.sulphur_dioxide?.[aqiIdx]?.toFixed(1) : "--"} unit="μg/m³"/>
          <WeatherCard label="Ozone" value={aqiIdx >= 0 ? aqiHourly?.ozone?.[aqiIdx]?.toFixed(1) : "--"} unit="μg/m³"/>
        </div>
      </div>

      {/* Hourly Charts */}
      <div>
        <h3 className="text-slate-300 font-medium mb-3">📊 Hourly Data</h3>
        <HourlyCharts hourlyData={hourly} selectedDate={selectedDate}/>
      </div>
    </div>
  );
}