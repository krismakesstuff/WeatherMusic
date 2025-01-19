
import './App.css'


// import { createDevice, IPatcher } from "@rnbo/js";


// let patcher: IPatcher;
// let context: AudioContext;

// context = new AudioContext();

// const setupRNBO = async () => {

//   patcher = await fetch("../export/rnboWeatherMusic.export.json").then((response) => response.json());

//   const device = await createDevice({
//       patcher: patcher,
//       context: context
//   });


//   device.node.connect(context.destination);

//   context.resume();

// }

// document.body.addEventListener('mousedown', () => {
//   context.resume();
// });

// setupRNBO();

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

const imageUrl = '/898.jpg';
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


  return (
    <>
    <h1>Weather Music</h1>
    <h3>Listen to music derived from the current weather. Use your location, or search for any location.</h3>
    <div>
        <input type="text" id="locationInput" placeholder="Latitude, Longitude"/>
        <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onClick={() => fetchWeatherData('map')}>Fetch Weather</button>
        <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onClick={() => fetchWeatherData('user')}>Use Current Location</button>
    </div>
    <h2 className="">Weather Info</h2>
    <div id="weatherInfo">
    </div>
    <div id="rnbo-device">
    </div>
    </>
  )
}

export default App
