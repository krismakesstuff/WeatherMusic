import { useState, useEffect } from "react";
import "./App.css";
import SynthControls from "./SynthControls.tsx";
import {openMeteoVariables} from "./WeatherInfo.tsx";
import OpenMeteoApiManager from "./OpenMeteoApiManager.ts";

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

async function fetchWeather(latLong: [number, number]): Promise<{data: {[key: string]: {[key: string]: string | number}} | null, error: string | null}> {
  console.log("fetching weather for: " + latLong[0] + ", " + latLong[1]);
  const latitude = "latitude=" + latLong[0];
  const longitude = "&longitude=" + latLong[1];
  // build URL
  const openMeteoAPI =
    "https://api.open-meteo.com/v1/forecast?" +
    latitude +
    longitude +
    openMeteoVariables[0]; // Now it's a single string

  console.log("OpenMeteo API URL:", openMeteoAPI);

  // Use the centralized API manager
  const apiManager = OpenMeteoApiManager.getInstance();
  const response = await apiManager.makeRequest(openMeteoAPI);

  return {
    data: response.data as {[key: string]: {[key: string]: string | number}} | null,
    error: response.error
  };
}

// React App ---------------------------------------------

function App() {
  const [weatherData, setWeatherData] = useState<{[key: string]: {[key: string]: string | number}}>({}); // OpenMeteo response
  const [weatherError, setWeatherError] = useState<string | null>(null); // Weather fetch error
  const [fetchLatLong, setFetchLatLong] = useState<[number, number]>([0,0]); // Lat, Long for OpenMeteo request
  const [currentMapCenter, setCurrentMapCenter] = useState<[number, number]>([0,0]); // Lat, Long for map center
  const [mapCenter, setMapCenter] = useState<[number, number]>([51.505, -0.09]); // Controlled map center
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false); // Loading state

  // Fetch Weather Data when fetchLatLong changes
  useEffect(() => {
    let ignore = false;

    if(fetchLatLong[0] !== 0 && fetchLatLong[1] !== 0){
      setIsLoadingWeather(true);
      setWeatherError(null);

      fetchWeather(fetchLatLong).then((result) => {
        if (!ignore) {
          if (result.error) {
            setWeatherError(result.error);
            setWeatherData({});
          } else if (result.data) {
            setWeatherData(result.data);
            setWeatherError(null);
          }
          setIsLoadingWeather(false);
        }
      });
    }
    return () => {
      ignore = true;
      setIsLoadingWeather(false);
    };
  }, [fetchLatLong]);

  // Manual retry function
  const retryWeatherFetch = () => {
    if (fetchLatLong[0] !== 0 && fetchLatLong[1] !== 0) {
      setFetchLatLong([...fetchLatLong]); // Trigger useEffect by creating new array
    }
  };

  // Fetch Location Callback
  function setFetchLocation(id: string) {
    if (id === "user") {
      console.log("Fetching weather for user location");
      // Get user location
      navigator.geolocation.getCurrentPosition((position) => {
        const userCoords: [number, number] = [position.coords.latitude, position.coords.longitude];
        setFetchLatLong(userCoords);
        setMapCenter(userCoords); // Snap map to user location
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
    <div className="flex flex-col h-svh bg-slate-800">
      <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 gap-3 flex flex-col justify-start items-center md:items-start text-center md:text-left p-4">
        <h1 className="text-2xl m-0">Weather Music</h1>
        <p className="text-sm m-0 w-full">
          Listen to music generated from the weather.
          <br></br>
          Use the map to choose a location.
        </p>
      </div>

        <SynthControls
            className="w-full md:w-1/2 h-fit px-4 py-4 md:pt-10 flex gap-1 md:gap-3 items-center justify-center md:justify-end"
            messageCallback={sendRNBOMessage}
            />

      </div>
        <Map
          className="flex-auto"
          setCurrentPosition={setCurrentMapCenter}
          center={mapCenter}
          weatherData={weatherData}
          weatherError={weatherError}
          isLoadingWeather={isLoadingWeather}
          onRetryWeather={retryWeatherFetch}
          currentMapCenter={currentMapCenter}
          onFetchLocation={setFetchLocation}
        />

        <div id="rnbo-device"></div>
    </div>
    </>
  );
}

export default App;
