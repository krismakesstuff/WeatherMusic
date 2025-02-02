import { useState } from 'react';

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import { Icon } from 'leaflet';

import "leaflet/dist/leaflet.css";
import crosshairIconPath from "./assets/crosshair.png";


// Leaflet Init ---------------------------------------------

// make crosshair for the map
const crosshairIcon = new Icon({
  iconUrl: crosshairIconPath,
  iconSize:     [40, 40], // size of the icon
  iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
});


interface CrosshairMarkerProps {
  position: [number, number];
  icon: Icon;
  setCurrentPosition: (position: [number, number]) => void;
  
}

function CrosshairMarker(props: CrosshairMarkerProps) {
  const [position, setPosition] = useState(props.position);

  const map = useMapEvents({
    move: () => {
      setPosition([map.getCenter().lat, map.getCenter().lng]);
      props.setCurrentPosition([map.getCenter().lat, map.getCenter().lng]);
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
}

export default function Map(props: MapProps) {

  return(
    <MapContainer className={props.className} 
      center={[51.505, -0.09]} 
      zoom={13} 
      scrollWheelZoom={true}
    >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    <CrosshairMarker position={[51.505, -0.09]} icon={crosshairIcon} setCurrentPosition={props.setCurrentPosition}/>
    </MapContainer>
  );
}