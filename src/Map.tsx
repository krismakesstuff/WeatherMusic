import { useState, useEffect } from 'react';

import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, LayersControl, ZoomControl } from 'react-leaflet'
import { Icon } from 'leaflet';
import SimpleRainLayer from './SimpleRainLayer';
import { WeatherInfo } from './WeatherInfo';

import "leaflet/dist/leaflet.css";
import crosshairIconPath from "./assets/crosshair.png";


// Leaflet Init ---------------------------------------------

// make crosshair for the map
const crosshairIcon = new Icon({
  iconUrl: crosshairIconPath,
  iconSize:     [40, 40], // size of the icon
  iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
});

// Component to handle programmatic map centering
function MapCenterController({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    // Validate that we have valid coordinates
    if (center && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
      const currentCenter = map.getCenter();
      const threshold = 0.0001; // Small threshold to avoid unnecessary updates

      // Only update if the position has actually changed
      const latDiff = Math.abs(currentCenter.lat - center[0]);
      const lngDiff = Math.abs(currentCenter.lng - center[1]);

      if (latDiff > threshold || lngDiff > threshold) {
        map.setView(center, map.getZoom());
      }
    }
  }, [center, map]);

  return null;
}


interface CrosshairMarkerProps {
  position: [number, number];
  icon: Icon;
  setCurrentPosition: (position: [number, number]) => void;

}

function CrosshairMarker(props: CrosshairMarkerProps) {
  const [position, setPosition] = useState(props.position);

  // Update position when props change (e.g., from "Current Location" button)
  useEffect(() => {
    setPosition(props.position);
  }, [props.position]);

  const map = useMapEvents({
    move: () => {
      // Update crosshair position during drag (visual only)
      const center = map.getCenter();
      const newPosition: [number, number] = [center.lat, center.lng];
      setPosition(newPosition);
      // Also notify parent immediately for coordinate display updates
      props.setCurrentPosition(newPosition);
    },
    moveend: () => {
      const center = map.getCenter();
      const newPosition: [number, number] = [center.lat, center.lng];

      // Only update parent component if position changed significantly (more than ~100 meters)
      const threshold = 0.001; // Roughly 100 meters
      const latDiff = Math.abs(newPosition[0] - position[0]);
      const lngDiff = Math.abs(newPosition[1] - position[1]);

      if (latDiff > threshold || lngDiff > threshold) {
        // Ensure parent has the final position
        props.setCurrentPosition(newPosition);
      }
    }
  });

  return (
  <Marker position={position} icon={props.icon}>
    <Popup>
        Position: {position}
      </Popup>
  </Marker>
  );

}

interface MapProps {
  className: string;
  setCurrentPosition: (position: [number, number]) => void;
  center?: [number, number];
  // Weather overlay props
  weatherData: {
    [key: string]: {
      [key: string]: string | number;
    };
  };
  weatherError: string | null;
  isLoadingWeather: boolean;
  onRetryWeather: () => void;
  currentMapCenter: [number, number];
  onFetchLocation: (id: string) => void;
  hasDataForCurrentPosition: boolean;
}

export default function Map(props: MapProps) {
  const defaultCenter: [number, number] = [51.505, -0.09];
  const mapCenter = props.center || defaultCenter;
  const [crosshairPosition, setCrosshairPosition] = useState<[number, number]>(mapCenter);

  // Update crosshair position when map center changes
  useEffect(() => {
    setCrosshairPosition(mapCenter);
  }, [mapCenter]);

  const handleCrosshairPositionChange = (position: [number, number]) => {
    setCrosshairPosition(position);
    props.setCurrentPosition(position);
  };

  // Determine coordinate outline color based on fetch status
  const getCoordinateOutlineColor = () => {
    if (props.isLoadingWeather) {
      return 'border-yellow-400'; // Loading state
    }
    return props.hasDataForCurrentPosition ? 'border-green-400' : 'border-red-400';
  };

  return(
    <div className={`${props.className} relative`}>
      <MapContainer
        className="w-full h-full"
        center={mapCenter}
        zoom={13}
        scrollWheelZoom={true}
        zoomControl={false}
      >
      <ZoomControl position="topright" />
      <LayersControl position="topright">
        <LayersControl.BaseLayer name="OpenStreetMap">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer checked name="Satellite">
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </LayersControl.BaseLayer>

        <LayersControl.Overlay name="City Names & Labels" checked={true}>
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
            url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png"
            opacity={0.8}
            pane="overlayPane"
          />
        </LayersControl.Overlay>

        <LayersControl.Overlay name="Radar" checked={true}>
          <SimpleRainLayer opacity={0.6} colorScheme={2} />
        </LayersControl.Overlay>
      </LayersControl>

      <MapCenterController center={mapCenter} />
      <CrosshairMarker position={mapCenter} icon={crosshairIcon} setCurrentPosition={handleCrosshairPositionChange}/>
      </MapContainer>

      {/* Weather Info Overlay - Left side, avoiding controls */}
      <div className="absolute left-2 md:left-4 top-4 z-[400] min-w-1/5 max-w-[80%] max-h-80 md:max-h-96 overflow-hidden rounded-lg pointer-events-none">
        <div className="pointer-events-auto">
          <WeatherInfo
            data={props.weatherData}
            error={props.weatherError}
            isLoading={props.isLoadingWeather}
            onRetry={props.onRetryWeather}
            className="bg-slate-800/90 backdrop-blur-sm shadow-lg text-white text-sm md:text-base max-h-80 md:max-h-96 overflow-y-auto"
          />
        </div>
      </div>

      {/* Lat/Long Control Bar - Bottom, mobile-optimized */}
      <div className="absolute bottom-4 left-2 right-2 md:left-1/2 md:right-auto md:-translate-x-1/2 z-[400] pointer-events-none">
        <div className={`bg-slate-800/90 backdrop-blur-sm p-2 md:p-4 rounded-lg shadow-lg border-2 ${getCoordinateOutlineColor()} text-white mx-auto max-w-4xl pointer-events-auto`}>
          <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-3">
            <div className="flex items-center gap-2 md:gap-4 flex-1 text-xs md:text-sm">
              <span className="font-bold whitespace-nowrap">
                Lat: <span className="font-mono">{crosshairPosition[0].toPrecision(6)}</span>
              </span>
              <span className="font-bold whitespace-nowrap">
                Long: <span className="font-mono">{crosshairPosition[1].toPrecision(6)}</span>
              </span>
            </div>
            <div className="flex gap-1 md:gap-2 w-full sm:w-auto">
              <button
                className="flex-1 sm:flex-none px-2 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-xs md:text-sm whitespace-nowrap"
                onClick={() => props.onFetchLocation("map")}
              >
                Fetch Weather
              </button>
              <button
                className="flex-1 sm:flex-none px-2 md:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors text-xs md:text-sm whitespace-nowrap"
                onClick={() => props.onFetchLocation("user")}
              >
                Current Location
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
