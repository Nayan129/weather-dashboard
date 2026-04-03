// PATH : src/hooks/useWeather.js
import { useState, useEffect } from "react";
import { fetchCurrentWeather } from "../api/weather";
import { format } from "date-fns";

export function useWeather(coords, selectedDate) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!coords) return;
    const dateStr = format(selectedDate || new Date(), "yyyy-MM-dd");
    setLoading(true);
    fetchCurrentWeather(coords.lat, coords.lon, dateStr)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [coords, selectedDate]);

  return { data, loading, error };
}