import React, { useState, useEffect } from "react";
import crosshairIconPath from "./assets/crosshair.png";
import "./App.css";
import SynthControls from "./SynthControls.tsx";
import {WeatherInfo, openMeteoVariables} from "./WeatherInfo.tsx";

// RNBO Init ---------------------------------------------

import { createDevice, IPatcher, Device } from "@rnbo/js";
const patcherPath: string =
  "/WeatherMusic/src/export/rnboWeatherMusic.export.json";
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
    context: context,
  }).then((device) => {
    console.log("Device created: ", device);
    return device;
  });

  device.node.connect(gainNode);
  gainNode.connect(context.destination);

  context.resume();
};

document.body.addEventListener("mousedown", () => {
  context.resume();
});

setupRNBO();

// Leaflet Init ---------------------------------------------

import {
  map,
  latLng,
  tileLayer,
  MapOptions,
  // imageOverlay,
  // latLngBounds,
  icon,
  marker,
} from "leaflet";
import "leaflet/dist/leaflet.css";

const options: MapOptions = {
  center: latLng(40.731253, -73.996139),
  zoom: 10,
  minZoom: 2,
  maxZoom: 14,
};

const theMap = map("map", options);
let crosshair: any;

// make crosshair for the map
const crosshairIcon = icon({
  iconUrl: crosshairIconPath,
  iconSize:     [40, 40], // size of the icon
  iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
});
crosshair = marker(theMap.getCenter(), {icon: crosshairIcon, interactive:false});
// Add the OpenStreetMap tiles
tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(theMap);
// Add the crosshair to the map
crosshair.addTo(theMap);

// Move the crosshair to the center of the map when the user pans
theMap.on('move', function(e) {
  crosshair.setLatLng(theMap.getCenter());
});

// OpenMeteo Init ---------------------------------------------

async function fetchWeather(lat: string, long: string) {
  console.log("fetching weather for: " + lat + ", " + long);
  const latitude = "latitude=" + lat;
  const longitude = "&longitude=" + long;
  // build URL
  const openMeteoAPI =
    "https://api.open-meteo.com/v1/forecast?" +
    latitude +
    longitude +
    openMeteoVariables.join(",");
  // fetch URL
  return fetch(openMeteoAPI)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

// React App ---------------------------------------------

function App() {
  const [weatherData, setWeatherData] = useState<object>({});
  const [latLong, setLatLong] = useState<string>('0,0');

  useEffect(() => {
  let ignore = false;
  const lat: string = latLong.split(",")[0];
  const long: string = latLong.split(",")[1];

  if(lat !== '0' && long !== '0'){
    fetchWeather(lat, long).then((data) => {
      if (!ignore) {
        setWeatherData(data);
      } 
    });
  }
  return () => { ignore = true; };
  }, [latLong]);

  function setLocation(id: string) {
    if (id === "user") {
      console.log("Fetching weather for user location");
      navigator.geolocation.getCurrentPosition((position) => {
        setLatLong(position.coords.latitude.toString() + "," + position.coords.longitude.toString());
      });
    } else if (id === "map") {
      console.log("Fetching weather for map location");
      const lat = theMap.getCenter().lat;
      const long = theMap.getCenter().lng;
      setLatLong(lat.toString() + "," + long.toString());

    }
  }

  function sendRNBOMessage(id: string, value: number) {
    console.log("Sending message to RNBO - ID: " + id + ", Value: " + value);

    if (id === "output-volume") {
      console.log("Setting volume to: " + value);
      gainNode.gain.value = value;
    } else {
      if (device) {
        device.parametersById.get(id).value = value;
      } else {
        console.log("Device not connected...");
      }
    }
  }

  return (
    <>
      <div className="md:grid md:grid-cols-2 md:grid-rows-2 md:text-left gap-3 flex flex-col items-center text-center p-4 bg-slate-600">
        <h1 className="text-3xl row-span-1">Weather Music</h1>
        <p className="">
          Listen to music generated from the current weather. 
          <br></br>
          Use the map to choose a location or use your own location.
        </p>
        <div className="md:col-start-2 md:col-end-3 md:row-span-full md:justify-self-center md:self-center flex gap-2">
          <input
            type="text"
            id="locationInput"
            placeholder="Latitude, Longitude"
            value={latLong}
          />
          <button onClick={() => setLocation("map")}>
            Fetch Weather
            </button>
          <button onClick={() => setLocation("user")}>
            Use Current Location
          </button>
        </div>
      </div>
      <WeatherInfo data={weatherData} className={'bg-slate-500 p-4'} />
      <div className="flex flex-col">
        <SynthControls
          className="absolute bottom-0 w-full p-4 flex gap-2 items-center justify-center bg-slate-800"
          messageCallback={sendRNBOMessage}
        />
        <div id="rnbo-device"></div>
      </div>
    </>
  );
}

export default App;
