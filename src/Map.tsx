import { useState } from 'react';

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import { Icon } from 'leaflet';

import "leaflet/dist/leaflet.css";
import crosshairIconPath from "./assets/crosshair.png";


// Leaflet Init ---------------------------------------------


// import {
//   map,
//   latLng,
//   tileLayer,
//   MapOptions,
//   // imageOverlay,
//   // latLngBounds,
//   icon,
//   marker,
// } from "leaflet";

// const options: MapOptions = {
//   center: latLng(40.731253, -73.996139),
//   zoom: 10,
//   minZoom: 2,
//   maxZoom: 14,
// };

// const theMap = map("map", options);
// let crosshair: any;

// make crosshair for the map
const crosshairIcon = new Icon({
  iconUrl: crosshairIconPath,
  iconSize:     [40, 40], // size of the icon
  iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
});
// crosshair = marker(theMap.getCenter(), {icon: crosshairIcon, interactive:false});
// // Add the OpenStreetMap tiles
// tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//   attribution:
//   '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// }).addTo(theMap);
// // Add the crosshair to the map
// crosshair.addTo(theMap);

// // Move the crosshair to the center of the map when the user pans
// theMap.on('move', function(e) {
//   crosshair.setLatLng(theMap.getCenter());
// });

interface CrosshairMarkerProps {
  position: [number, number];
  icon: Icon;
}

function CrosshairMarker(props: CrosshairMarkerProps) {
  const [position, setPosition] = useState(props.position);

  const map = useMapEvents({
    move: () => {
      setPosition([map.getCenter().lat, map.getCenter().lng]);
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
}


export default function Map(props: MapProps) {
  


  return(
    <MapContainer className={props.className} center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    <CrosshairMarker position={[51.505, -0.09]} icon={crosshairIcon}/>
    </MapContainer>
  );
}