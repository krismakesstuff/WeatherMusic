import { useState } from "react";

export const openMeteoVariables = [
  "&current=temperature_2m,temperature_80m,dew_point_2m,precipitation_probability,precipitation,rain,snowfall,snow_depth,pressure_msl,surface_pressure,cloud_cover,wind_speed_10m,wind_direction_10m,weather_code"
];

// Mapping of API field names to readable display names
const fieldDisplayNames: { [key: string]: string } = {
  temperature_2m: "Temperature (2m)",
  temperature_80m: "Temperature (80m)",
  dew_point_2m: "Dew Point",
  precipitation_probability: "Precipitation Chance",
  precipitation: "Precipitation",
  rain: "Rain",
  snowfall: "Snowfall",
  snow_depth: "Snow Depth",
  pressure_msl: "Sea Level Pressure",
  surface_pressure: "Surface Pressure",
  cloud_cover: "Cloud Cover",
  wind_speed_10m: "Wind Speed",
  wind_direction_10m: "Wind Direction",
  weather_code: "Weather Code"
};

// Function to format values with appropriate units
const formatValue = (key: string, value: string | number): string => {
  const numValue = typeof value === 'number' ? value : parseFloat(value.toString());

  switch (key) {
    case 'temperature_2m':
    case 'temperature_80m':
    case 'dew_point_2m':
      return `${numValue}°C`;
    case 'precipitation_probability':
    case 'cloud_cover':
      return `${numValue}%`;
    case 'precipitation':
    case 'rain':
    case 'snowfall':
    case 'snow_depth':
      return `${numValue} mm`;
    case 'pressure_msl':
    case 'surface_pressure':
      return `${numValue} hPa`;
    case 'wind_speed_10m':
      return `${numValue} km/h`;
    case 'wind_direction_10m':
      return `${numValue}°`;
    default:
      return value.toString();
  }
};

interface WeatherDataItemProps {
  label: string;
  value: string;
}

function WeatherDataItem({ label, value }: WeatherDataItemProps) {
  return (
    <li className="flex justify-between items-center m-2 py-2 px-3 bg-slate-600 rounded-md">
      <span className="font-medium text-slate-200">{label}:</span>
      <span className="text-white">{value}</span>
    </li>
  );
}

interface WeatherInfoProps {
  className: string;
  data: {
    [key: string]: {
      [key: string]: string | number;
    };
  };
  error: string | null;
  isLoading: boolean;
  onRetry: () => void;
}

export function WeatherInfo(props: WeatherInfoProps) {
  const [isCollapsed, setIsCollapsed] = useState(true); // Default to collapsed

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const headerContent = (
    <div className="sticky top-0 flex items-center justify-between cursor-pointer bg-slate-700 border-b-2 border-slate-400" onClick={toggleCollapse}>
      <h2 className="text-base font-normal p-2 pr-4">Weather Info</h2>
      <button
        className="text-white hover:text-slate-300 transition-colors p-1 m-2"
        aria-label={isCollapsed ? "Expand weather info" : "Collapse weather info"}
      >
        <svg
          className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-0' : 'rotate-180'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );

  // Show loading state
  if (props.isLoading) {
    return (
      <div className={props.className}>
        {headerContent}
        {!isCollapsed && (
          <div className="flex items-center gap-2 mt-3">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <p className="text-slate-300">Loading weather data...</p>
          </div>
        )}
      </div>
    );
  }

  // Show error state
  if (props.error) {
    return (
      <div className={props.className}>
        {headerContent}
        {!isCollapsed && (
          <div className="bg-red-600 p-3 rounded-md mt-3">
            <p className="font-semibold text-red-100">Error fetching weather data:</p>
            <p className="text-red-200 text-sm mt-1">{props.error}</p>
            <button
              onClick={props.onRetry}
              className="mt-2 px-3 py-1 bg-red-500 hover:bg-red-400 text-white rounded-md text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    );
  }

  // Show data if available
  if ("current" in props.data) {
    console.log("Building Weather Info Data: ", props.data);

    function renderDataItems() {
      return Object.entries(props.data["current"]).map(([id, value]) => {
        const displayName = fieldDisplayNames[id] || id;
        const formattedValue = formatValue(id, value);
        return <WeatherDataItem key={id} label={displayName} value={formattedValue} />;
      });
    }

    return (
      <div className={props.className}>
        {headerContent}
        {!isCollapsed && (
          <ul className="space-y-2 my-3">{renderDataItems()}</ul>
        )}
      </div>
    );
  } else {
    // No data available
    return (
      <div className={props.className}>
        {headerContent}
        {!isCollapsed && (
          <p className="text-slate-300 mt-3">No Data Available - Click "Fetch Weather" to get weather data for the current location</p>
        )}
      </div>
    );
  }
}
