import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

// Heat layer interface for better typing
interface HeatLayer extends L.Layer {
  setLatLngs(latlngs: Array<[number, number, number]>): this;
  addLatLng(latlng: [number, number, number]): this;
  redraw(): this;
}

// Extend the L namespace to include HeatLayer
declare module 'leaflet' {
  function heatLayer(
    points: Array<[number, number, number]>,
    options?: {
      radius?: number;
      blur?: number;
      maxZoom?: number;
      max?: number;
      minOpacity?: number;
      gradient?: { [key: string]: string };
    }
  ): HeatLayer;
}

interface WeatherDataPoint {
  lat: number;
  lng: number;
  value: number;
}

interface WeatherHeatMapLayerProps {
  data: WeatherDataPoint[];
  options?: {
    radius?: number;
    blur?: number;
    maxZoom?: number;
    max?: number;
    minOpacity?: number;
    gradient?: { [key: string]: string };
  };
  dataType: 'temperature' | 'precipitation' | 'wind' | 'pressure' | 'humidity';
}

// Default gradients for different data types
const defaultGradients = {
  temperature: {
    '0.0': '#000080', // Dark blue (cold)
    '0.2': '#0000FF', // Blue
    '0.4': '#00FFFF', // Cyan
    '0.6': '#FFFF00', // Yellow
    '0.8': '#FF8000', // Orange
    '1.0': '#FF0000'  // Red (hot)
  },
  precipitation: {
    '0.0': '#FFFFFF', // White (no precipitation)
    '0.2': '#E0E0FF', // Light blue
    '0.4': '#8080FF', // Medium blue
    '0.6': '#4040FF', // Darker blue
    '0.8': '#0020FF', // Deep blue
    '1.0': '#000080'  // Navy (heavy precipitation)
  },
  wind: {
    '0.0': '#FFFFFF', // White (calm)
    '0.2': '#E0FFE0', // Light green
    '0.4': '#80FF80', // Medium green
    '0.6': '#FFFF00', // Yellow (moderate wind)
    '0.8': '#FF8000', // Orange (strong wind)
    '1.0': '#FF0000'  // Red (very strong wind)
  },
  pressure: {
    '0.0': '#8000FF', // Purple (low pressure)
    '0.2': '#0080FF', // Blue
    '0.4': '#00FFFF', // Cyan
    '0.6': '#80FF80', // Light green (normal pressure)
    '0.8': '#FFFF00', // Yellow
    '1.0': '#FF0000'  // Red (high pressure)
  },
  humidity: {
    '0.0': '#8B4513', // Brown (dry)
    '0.2': '#FFD700', // Gold
    '0.4': '#FFFF00', // Yellow
    '0.6': '#80FF80', // Light green
    '0.8': '#00FFFF', // Cyan
    '1.0': '#0000FF'  // Blue (humid)
  }
};

// Default options for different data types
const defaultOptions = {
  temperature: {
    radius: 25,
    blur: 35,
    maxZoom: 18,
    minOpacity: 0.1
  },
  precipitation: {
    radius: 20,
    blur: 25,
    maxZoom: 18,
    minOpacity: 0.2
  },
  wind: {
    radius: 30,
    blur: 40,
    maxZoom: 18,
    minOpacity: 0.1
  },
  pressure: {
    radius: 35,
    blur: 45,
    maxZoom: 18,
    minOpacity: 0.1
  },
  humidity: {
    radius: 25,
    blur: 35,
    maxZoom: 18,
    minOpacity: 0.15
  }
};

export default function WeatherHeatMapLayer({
  data,
  options = {},
  dataType
}: WeatherHeatMapLayerProps) {
  const map = useMap();
  const heatLayerRef = useRef<HeatLayer | null>(null);

  useEffect(() => {
    // Remove existing heat layer if it exists
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
    }

    // Only create heatmap if we have data
    if (!data || data.length === 0) {
      return;
    }

    // Prepare data for heat layer - format: [lat, lng, intensity]
    const heatData: Array<[number, number, number]> = data.map(point => [
      point.lat,
      point.lng,
      point.value
    ]);

    // Get default options for this data type
    const typeDefaults = defaultOptions[dataType];

    // Merge user options with defaults
    const heatOptions = {
      ...typeDefaults,
      ...options,
      gradient: options.gradient || defaultGradients[dataType]
    };

    // Find min/max values to normalize the data if max is not provided
    if (!heatOptions.max && data.length > 0) {
      const values = data.map(d => d.value);
      const minVal = Math.min(...values);
      const maxVal = Math.max(...values);

      // Normalize data to 0-1 range for better heatmap display
      if (maxVal > minVal) {
        heatData.forEach((point, index) => {
          point[2] = (data[index].value - minVal) / (maxVal - minVal);
        });
        heatOptions.max = 1;
      }
    }

    // Create and add the heat layer
    heatLayerRef.current = L.heatLayer(heatData, heatOptions);
    heatLayerRef.current.addTo(map);

    // Cleanup function
    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
      }
    };
  }, [map, data, options, dataType]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
      }
    };
  }, [map]);

  return null; // This component doesn't render anything directly
}

export type { WeatherDataPoint };
