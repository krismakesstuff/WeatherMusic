
import './App.css'

import { createDevice, IPatcher } from "@rnbo/js";


let patcher: IPatcher;
let context: AudioContext;

context = new AudioContext();

const setup = async () => {

  patcher = await fetch("../export/rnboWeatherMusic.export.json").then((response) => response.json());

  const device = await createDevice({
      patcher: patcher,
      context: context
  });

  
  device.node.connect(context.destination);
  
  context.resume();
    
}

document.body.addEventListener('mousedown', () => {
  context.resume();
});

setup();

function App() {

  return (
    <>
    <h1>Weather Music</h1>
    <h3>Listen to music derived from the current weather. Use your location, or search for any location.</h3>
    <div>
        <input type="text" id="locationInput" placeholder="Latitude, Longitude"/>
        <button id="fetchWeatherBtn" >Fetch Weather</button>
        <button id="currentLocationBtn" >Use Current Location</button>
    </div>
    <h2>Weather Info</h2>
    <div id="weatherInfo">
    </div>
    <div id="rnbo-device">
    </div>
    <div id="map"></div>
    </>
  )
}

export default App
