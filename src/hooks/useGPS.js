// PATH : src/hooks/useGPS.js

import { useState, useEffect } from "react";

export function useGPS() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }
    // pos is for position
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setLoading(false);
      },
      
      // Fallback: Nagpur coordinates
      (err) => {
        setCoords({ lat: 21.1458, lon: 79.0882 });
        setLoading(false);
      },
      { timeout: 5000 }
    );
  }, []);

  return { coords, error, loading };
}