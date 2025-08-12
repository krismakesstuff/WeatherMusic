import { useEffect, useState } from 'react';
import WeatherHeatMapLayer, { WeatherDataPoint } from './WeatherHeatMapLayer';

interface TemperatureHeatMapProps {
  centerLat: number;
  centerLng: number;
  currentTemperature?: number; // Temperature from the current weather data
}

// Generate mock temperature data in a grid around the center point
// In a real implementation, this would fetch from a weather service that provides grid data
function generateTemperatureGrid(
  centerLat: number,
  centerLng: number,
  baseTemp: number = 20
): WeatherDataPoint[] {
  const points: WeatherDataPoint[] = [];
  const gridSize = 0.01; // About 1km at equator
  const gridCount = 15; // 15x15 grid for better coverage
  const halfGrid = Math.floor(gridCount / 2);

  for (let i = 0; i < gridCount; i++) {
    for (let j = 0; j < gridCount; j++) {
      const lat = centerLat + (i - halfGrid) * gridSize;
      const lng = centerLng + (j - halfGrid) * gridSize;

      // Generate realistic temperature variation
      // Add some noise and gradients to make it look more realistic
      const distanceFromCenter = Math.sqrt(
        Math.pow(i - halfGrid, 2) + Math.pow(j - halfGrid, 2)
      );

      // Create temperature variations based on:
      // 1. Distance from center (urban heat island effect)
      // 2. Random noise for micro-climates
      // 3. Elevation simulation (northwest corners slightly cooler)
      const heatIslandEffect = Math.max(0, 2 - distanceFromCenter * 0.3);
      const elevationEffect = (i + j) * -0.05; // Northwest cooler
      const microClimate = (Math.random() - 0.5) * 1.5; // ±0.75°C random variation

      const temperature = baseTemp + heatIslandEffect + elevationEffect + microClimate;

      points.push({
        lat,
        lng,
        value: Math.max(-30, Math.min(50, temperature)) // Clamp to reasonable range
      });
    }
  }

  return points;
}

export default function TemperatureHeatMap({
  centerLat,
  centerLng,
  currentTemperature = 20
}: TemperatureHeatMapProps) {
  const [temperatureData, setTemperatureData] = useState<WeatherDataPoint[]>([]);

  useEffect(() => {
    // Generate temperature grid data
    const gridData = generateTemperatureGrid(centerLat, centerLng, currentTemperature);
    setTemperatureData(gridData);
  }, [centerLat, centerLng, currentTemperature]);

  return (
    <WeatherHeatMapLayer
      data={temperatureData}
      dataType="temperature"
      options={{
        radius: 20,
        blur: 25,
        minOpacity: 0.4,
        maxZoom: 18
      }}
    />
  );
}
