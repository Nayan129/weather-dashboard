// src/api/weather.js
import axios from "axios";

const BASE = "https://api.open-meteo.com/v1";
const AQI_BASE = "https://air-quality-api.open-meteo.com/v1";

export async function fetchCurrentWeather(lat, lon, date) {
  const [weatherRes, aqiRes] = await Promise.all([
    axios.get(`${BASE}/forecast`, {
      params: {
        latitude: lat,
        longitude: lon,
        daily: [
          "temperature_2m_max",
          "temperature_2m_min",
          "precipitation_sum",
          "sunrise",
          "sunset",
          "windspeed_10m_max",
          "uv_index_max",
          "precipitation_probability_max",
        ].join(","),
        hourly: [
          "temperature_2m",
          "relativehumidity_2m",
          "precipitation",
          "visibility",
          "windspeed_10m",
          "pm10",
          "pm2_5",
        ].join(","),
        current_weather: true,
        timezone: "auto",
        start_date: date,
        end_date: date,
      },
    }),
    axios.get(`${AQI_BASE}/air-quality`, {
      params: {
        latitude: lat,
        longitude: lon,
        hourly: [
          "pm10",
          "pm2_5",
          "carbon_monoxide",
          "nitrogen_dioxide",
          "sulphur_dioxide",
          "ozone",
        ].join(","),
        current_weather: true,
        timezone: "auto",
        start_date: date,
        end_date: date,
      },
    }),
  ]);

  return { weather: weatherRes.data, aqi: aqiRes.data };
}

export async function fetchHistoricalWeather(lat, lon, startDate, endDate) {
  const [weatherRes, aqiRes] = await Promise.all([
    axios.get(`${BASE}/archive`, {
      params: {
        latitude: lat,
        longitude: lon,
        daily: [
          "temperature_2m_max",
          "temperature_2m_min",
          "temperature_2m_mean",
          "sunrise",
          "sunset",
          "precipitation_sum",
          "windspeed_10m_max",
          "winddirection_10m_dominant",
          "pm10",
          "pm2_5",
        ].join(","),
        timezone: "auto",
        start_date: startDate,
        end_date: endDate,
      },
    }),
    axios.get(`${AQI_BASE}/air-quality`, {
      params: {
        latitude: lat,
        longitude: lon,
        hourly: ["pm10", "pm2_5"].join(","),
        timezone: "auto",
        start_date: startDate,
        end_date: endDate,
      },
    }),
  ]);
  return { weather: weatherRes.data, aqi: aqiRes.data };
}
