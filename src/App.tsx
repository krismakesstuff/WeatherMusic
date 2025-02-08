import React, { useState, useEffect } from "react";
import "./App.css";
import SynthControls from "./SynthControls.tsx";
import {WeatherInfo, openMeteoVariables} from "./WeatherInfo.tsx";

import Map from "./Map.tsx";

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


// OpenMeteo Init ---------------------------------------------

async function fetchWeather(latLong: [number, number]) {
  console.log("fetching weather for: " + latLong[0] + ", " + latLong[1]);
  const latitude = "latitude=" + latLong[0];
  const longitude = "&longitude=" + latLong[1];
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
  const [weatherData, setWeatherData] = useState<object>({}); // OpenMeteo response
  const [fetchLatLong, setFetchLatLong] = useState<[number, number]>([0,0]); // Lat, Long for OpenMeteo request
  const [currentMapCenter, setCurrentMapCenter] = useState<[number, number]>([0,0]); // Lat, Long for map center

  // Fetch Weather Data when fetchLatLong changes
  useEffect(() => {
    let ignore = false;

    if(fetchLatLong[0] !== 0 && fetchLatLong[1] !== 0){
      fetchWeather(fetchLatLong).then((data) => {
        if (!ignore) {
          setWeatherData(data);
        } 
      });
    }
    return () => { ignore = true; };
  }, [fetchLatLong]);

  // Fetch Location Callback
  function setFetchLocation(id: string) {
    if (id === "user") {
      console.log("Fetching weather for user location");
      // Get user location
      navigator.geolocation.getCurrentPosition((position) => {
        setFetchLatLong([position.coords.latitude, position.coords.longitude]);
      });
    } else if (id === "map") {
      console.log("Fetching weather for map location");
      //Get map location
      setFetchLatLong(currentMapCenter);

    } 
    // else if (id === "input") {
    //   console.log("Fetching weather for input location");
    //   // Get input location
    //   const location = document.querySelector("input") as HTMLInputElement;
    //   const lat: number = parseFloat(location.value.split(",")[0]);
    //   const long: number = parseFloat(location.value.split(",")[1]); 
    //   setFetchLatLong([lat, long]);
    // }
  }

  // RNBO Message Callback
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

  // App
  return (
    <>
    <div className="flex flex-col h-svh">
      <div className="gap-3 flex flex-col items-center text-center p-4 bg-slate-800">
        <h1 className="text-2xl row-span-1 m-0">Weather Music</h1>
        <p className="text-sm m-0">
          Listen to music generated from the weather. 
          <br></br>
          Use the map to choose a location.
        </p>
      </div>
        <WeatherInfo data={weatherData} className={'bg-slate-500 p-4'} />
        <Map className="flex-auto" setCurrentPosition={setCurrentMapCenter}/>
      <div className="flex flex-col">
        <div className="md:col-start-2 md:col-end-3 md:row-span-full md:justify-self-center md:self-center w-full flex items-center gap-2 p-4 bg-slate-500">
            <p>Lat: </p>
            <input
              className="p-2 rounded-md bg-slate-600 w-1/2"
              type="text"
              value={currentMapCenter[0].toPrecision(4).toString()}
              >
            </input>
            <p>Long: </p>
              <input 
              className="p-2 rounded-md bg-slate-600 w-1/2" 
              type="text" 
              value={currentMapCenter[1].toPrecision(4).toString()}
              />
            <button 
              className={'w-full h-auto'} 
              onClick={() => setFetchLocation("map")}
              >
              Fetch Weather
              </button>
            <button
              className={'w-full h-auto'} 
              onClick={() => setFetchLocation("user")}
              >
              Current Location
            </button>
          </div>
        <SynthControls
          className="w-full p-4 flex gap-2 items-center justify-center bg-slate-800"
          messageCallback={sendRNBOMessage}
          />
        <div id="rnbo-device"></div>
      </div>
    </div>
    </>
  );
}

export default App;
