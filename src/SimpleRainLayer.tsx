import { useEffect, useState } from 'react';
import { TileLayer } from 'react-leaflet';

interface RainViewerFrame {
  time: number;
  path: string;
}

interface RainViewerApiData {
  version: string;
  generated: number;
  host: string;
  radar: {
    past: RainViewerFrame[];
    nowcast?: RainViewerFrame[];
  };
}

interface SimpleRainLayerProps {
  opacity?: number;
  colorScheme?: number;
}

export default function SimpleRainLayer({
  opacity = 0.6,
  colorScheme = 2
}: SimpleRainLayerProps) {
  const [tileUrl, setTileUrl] = useState<string>('');

  useEffect(() => {
    const fetchLatestFrame = async () => {
      try {
        const response = await fetch('https://api.rainviewer.com/public/weather-maps.json');
        if (response.ok) {
          const data: RainViewerApiData = await response.json();

          // Get the latest radar frame
          if (data.radar?.past && data.radar.past.length > 0) {
            const latestFrame = data.radar.past[data.radar.past.length - 1];
            const url = `${data.host}${latestFrame.path}/256/{z}/{x}/{y}/${colorScheme}/1_1.png`;
            setTileUrl(url);
          }
        }
      } catch (error) {
        console.error('Error fetching rain data:', error);
      }
    };

    fetchLatestFrame();

    // Refresh every 10 minutes
    const interval = setInterval(fetchLatestFrame, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [colorScheme]);

  if (!tileUrl) {
    return null;
  }

  return (
    <TileLayer
      url={tileUrl}
      opacity={opacity}
      attribution="© RainViewer"
      maxZoom={18}
      pane="overlayPane"
    />
  );
}
