import React, { useState, useEffect } from "react";
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
  imageOverlay,
  latLngBounds,
} from "leaflet";
import "leaflet/dist/leaflet.css";

const options: MapOptions = {
  center: latLng(40.731253, -73.996139),
  zoom: 10,
  minZoom: 2,
  maxZoom: 14,
};

const mymap = map("map", options);

tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(mymap);

const imageUrl = "/WeatherMusic/898.jpg";
const errorOverlayUrl = "https://cdn-icons-png.flaticon.com/512/110/110686.png";
const altText =
  "Image of Newark, N.J. in 1922. Source: The University of Texas at Austin, UT Libraries Map Collection.";
const bounds = latLngBounds([
  [40.799311, -74.118464],
  [40.68202047785919, -74.33],
]);

imageOverlay(imageUrl, bounds, {
  opacity: 0.8,
  errorOverlayUrl: errorOverlayUrl,
  alt: altText,
  interactive: true,
}).addTo(mymap);

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
      <div className="flex flex-col items-center text-center">
        <h1 className="text-3xl ">Weather Music</h1>
        <h3>
          Listen to music derived from the current weather. Use your location,
          or search for any location.
        </h3>
        <div>
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
        <WeatherInfo data={weatherData} />
      </div>
      <div className="flex flex-col">
        <SynthControls
          className="flex items-center justify-center w-full"
          messageCallback={sendRNBOMessage}
        />
        <div id="rnbo-device"></div>
      </div>
    </>
  );
}

export default App;
