
import './App.css'
import  Controls  from './Controls.tsx'


import { createDevice, IPatcher, Device } from "@rnbo/js";
const patcherPath: string = "/WeatherMusic/src/export/rnboWeatherMusic.export.json";
let patcher: IPatcher;
let device: Device;
const context: AudioContext = new AudioContext();
const gainNode = context.createGain();
gainNode.gain.value = 0.75; // Set initial gain value


const setupRNBO = async () => {

  patcher = await fetch(patcherPath).then((response) => response.json());
  console.log("Patcher loaded: ", patcher);

  device = await createDevice({
      patcher: patcher,
      context: context
  }).then((device) => {
    console.log("Device created: ", device);
    return device;
  });


  device.node.connect(gainNode);
  gainNode.connect(context.destination);

  context.resume();
}

document.body.addEventListener('mousedown', () => {
  context.resume();
});

setupRNBO();

import { map, latLng, tileLayer, MapOptions, imageOverlay, latLngBounds } from "leaflet";
import 'leaflet/dist/leaflet.css';

const options: MapOptions = {
  center: latLng(40.731253, -73.996139),
  zoom: 10,
  minZoom: 2,
  maxZoom: 14
};

const mymap = map('map', options);

tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

const imageUrl = '/WeatherMusic/898.jpg';
const errorOverlayUrl = 'https://cdn-icons-png.flaticon.com/512/110/110686.png';
const altText = 'Image of Newark, N.J. in 1922. Source: The University of Texas at Austin, UT Libraries Map Collection.';
const bounds = latLngBounds([[40.799311, -74.118464], [40.68202047785919, -74.33]]);

imageOverlay(imageUrl, bounds, {
    opacity: 0.8,
    errorOverlayUrl: errorOverlayUrl,
    alt: altText,
    interactive: true
}).addTo(mymap);

function App() {

  function fetchWeatherData(id: string) {

    if(id === 'map') {
      console.log("fetching weather data with id: " + id + ", Location: ");
    }
    else if(id === 'user') {
      console.log("fetching weather data with id: " + id + ", Location: ");
    }
  }


  function sendRNBOMessage(id: string, value: number) {

    console.log("Sending message to RNBO - ID: " + id + ", Value: " + value);

    if(id === 'output-volume') {
      console.log("Setting volume to: " + value);
      gainNode.gain.value = value;
    } else {
      if(device){
        device.parametersById.get(id).value = value;
      } else {
        console.log("Device not connected...");
      }
    }

  }

  return (
    <>
    <div className="flex flex-col items-center text-center">
      <h1 className="text-3xl ">Weather Music</h1>
      <h3>Listen to music derived from the current weather. Use your location, or search for any location.</h3>
      <div>
          <input type="text" id="locationInput" placeholder="Latitude, Longitude"/>
          <button onClick={() => fetchWeatherData('map')}>Fetch Weather</button>
          <button onClick={() => fetchWeatherData('user')}>Use Current Location</button>
      </div>
      <h2 className="">Weather Info</h2>
    </div>
    <div className="flex flex-col">
      <Controls className="flex items-center justify-center w-full"
        messageCallback={sendRNBOMessage}
      />
      <div id="weatherInfo" className="p-4">
      </div>
      <div id="rnbo-device">
      </div>
    </div>
    </>
  )
}

export default App
