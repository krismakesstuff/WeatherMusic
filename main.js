//import { MapsAPIKey } from "./credentials.js";
// import { Loader } from 'google.maps.plugins.loader.Loader';

import { createRNBODevice, patchExportURL, device, context } from './rnbo-helpers.js';


// setup rnbo device
async function setupRNBO() {

    try{
        await createRNBODevice(patchExportURL);
        console.log("RNBO Device Created");

        // log presets from device
        console.log("Presets: ");
        //console.log(device.presets);

        device.parameters.forEach((param) => {
            console.log('Parameter: ');
            console.log(param);
        });

    } catch (err) {
        console.log("Error creating RNBO device");
        console.log(err);
        throw err;
    }

}


let openMeteoVariables = ['&hourly=','temperature_2m','dew_point_2m','precipitation_probability','precipitation','rain','snowfall','snow_depth','pressure_msl','surface_pressure','cloud_cover','wind_speed_10m','temperature_80m', 'wind_direction_10m','&forecast_days=1'];

let map;

let userLatitude;
let userLongitude;

const defaultZoom = 4;

// not using
async function loadMapsAPILibrary() {
    // Load the Google Maps JavaScript API library.
    const loader = new Loader({
        apiKey: MapsAPIKey,
        version: "weekly",
    });

    loader.importLibrary("maps")
}

// not using
async function initMap() {

    if(userLatitude && userLongitude) {


        // The location of Uluru
        const position = { lat: userLatitude, lng: userLongitude };
        let title = 'User Location';

        // Request needed libraries.
        //@ts-ignore
        const { Map } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

        // The map, centered at Uluru
        map = new Map(document.getElementById("map"), {
            zoom: 3,
            center: position,
            mapId: "DEMO_MAP_ID",
        });

        // The marker, positioned at Uluru
        const marker = new AdvancedMarkerElement({
            map: map,
            position: position,
            title: "Uluru",
        });
    } else {    
        // The location of Uluru
        const uluru = { lat: -25.344, lng: 131.036 };
        // Request needed libraries.
        //@ts-ignore
        const { Map } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

        // The map, centered at Uluru
        map = new Map(document.getElementById("map"), {
            zoom: defaultZoom,
            center: uluru,
            mapId: "DEMO_MAP_ID",
        });

        // The marker, positioned at Uluru
        const marker = new AdvancedMarkerElement({
            map: map,
            position: uluru,
            title: "Uluru",
        });
    }
}

// not using
async function updateMap(latitude, longitude) {
    // The location of Uluru
    const position = { lat: latitude, lng: longitude};
    // Request needed libraries.
    //@ts-ignore
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    // The map, centered at Uluru
    map = new Map(document.getElementById("map"), {
        zoom: defaultZoom,
        center: position,
        mapId: "DEMO_MAP_ID",
    });

    // The marker, positioned at Uluru
    const marker = new AdvancedMarkerElement({
        map: map,
        position: position,
        title: "Uluru",
    });
}

// updates HTML from API response
async function fetchWeather(lat, long) {
    console.log('fetching weather for: ' + lat + ', ' + long);

    let latitude = 'latitude=' + lat;
    let longitude = '&longitude=' + long;

    // build URL
    let openMeteoAPI = 'https://api.open-meteo.com/v1/forecast?' + latitude + longitude + openMeteoVariables.join(',');

    // fetch URL
    fetch(openMeteoAPI)
      .then(response => response.json())
      .then(data => {
        console.log(data)

        if(data.current){

            // get the weather info from the response
            const currentTemp = data.current.temperature_2m;
            const tempUnit = data.current_units.temperature_2m;
            const currentRain = data.current.rain;
            const rainUnit = data.current_units.rain;
            const currentHumidity = data.current.relative_humidity_2m;
            const humidityUnit = data.current_units.relative_humidity_2m; 
            const currentWindSpeed = data.current.wind_speed_10m;  
            const windSpeedUnit = data.current_units.wind_speed_10m;
            const currentWindDirection = data.current.wind_direction_10m;
            const windDirectionUnit = data.current_units.wind_direction_10m;
            const currentSurfacePressure = data.current.surface_pressure;
            const surfacePressureUnit = data.current_units.surface_pressure;
            const currentPrecipitation = data.current.precipitation;
            const precipitationUnit = data.current_units.precipitation;
            
            // update the HTML from the current variables 
            document.getElementById('temperature_2m').textContent = currentTemp + ' ' + tempUnit;
            document.getElementById('rain').textContent = currentRain + ' ' + rainUnit;
            document.getElementById('relative_humidity_2m').textContent = currentHumidity + ' ' + humidityUnit;
            document.getElementById('wind_speed_10m').textContent = currentWindSpeed + ' ' + windSpeedUnit;
            document.getElementById('wind_direction_10m').textContent = currentWindDirection + ' ' + windDirectionUnit;
            document.getElementById('surface_pressure').textContent = currentSurfacePressure + ' ' + surfacePressureUnit;
            document.getElementById('precipitation').textContent = currentPrecipitation + ' ' + precipitationUnit;

        } else if (data.hourly) {
                
            // get the current time
            let currentTime = new Date();
            //let currentHour = currentTime.getHours() - 1;
            let currentHour = 0;
            console.log("Current Hour: " + currentHour);
            openMeteoVariables.forEach((variable) => {
                if(variable.includes('&')){
                    return;
                }
                    // get the data from the response
                    let variableName = variable;
                    let variableValue = data.hourly[variableName][currentHour];
                    let variableUnit = data.hourly_units[variableName];
                    // update the HTML
                    document.getElementById(variableName).textContent = variableValue + ' ' + variableUnit;
                    // update RNBO parameters
                    if(device && context) {
                        device.parametersById.get('rnbo-' + variableName).value = variableValue;
                    } else {
                        console.log('Device not ready in fecthWeather call');
                    }
                });

                // document.getElementById('temperature_2m').textContent = hrTemp + ' ' + tempUnit;
                // document.getElementById('rain').textContent = hrRain + ' ' + rainUnit;
                // document.getElementById('relative_humidity_2m').textContent = hrHumidity + ' ' + humidityUnit;
                // document.getElementById('wind_speed_10m').textContent = hrWindSpeed + ' ' + windSpeedUnit;
                // document.getElementById('wind_direction_10m').textContent = hrWindDirection + ' ' + windDirectionUnit;
                // document.getElementById('surface_pressure').textContent = hrSurfacePressure + ' ' + surfacePressureUnit;
                // document.getElementById('precipitation').textContent = hrPrecipitation + ' ' + precipitationUnit;

            }


        // update the location input 
        document.getElementById('locationInput').value = lat + ', ' + long;


        // // update the RNBO parameters
        // if(device && context) {

        //     device.parametersById.get('rnbo-rain').value = currentRain;
        //     device.parametersById.get('rnbo-temperature').value = currentTemp;
        //     device.parametersById.get('rnbo-humidity').value = currentHumidity;
        //     device.parametersById.get('rnbo-windspeed').value = currentWindSpeed;
        //     device.parametersById.get('rnbo-winddirection').value = currentWindDirection;
        //     device.parametersById.get('rnbo-pressure').value = currentSurfacePressure
        //     device.parametersById.get('rnbo-daynight').value = data.current.is_day;
        //     console.log('RNBO Parameters updated');
        // } else {
        //     console.log('Device not ready in fecthWeather call');
        // }

      });
}

async function getUserLocationAndFetch(){
    console.log('Fetching weather for user location');

    navigator.geolocation.getCurrentPosition((position) => {    
        userLatitude = position.coords.latitude;
        userLongitude = position.coords.longitude;

        console.log('User Location, Lat: ' + userLatitude + ', Long: ' + userLongitude);
        fetchWeather(userLatitude, userLongitude);
        //updateMap(userLatitude, userLongitude);
    });
}


function getInputLocationAndFetch() {
    const inputLocation = document.getElementById('locationInput').value;
    console.log('Input location: ' + inputLocation);

    let location = inputLocation.replace(/\s/g, '').split(',');
    let latitude = location[0];  
    let longitude = location[1]; 

    fetchWeather(latitude, longitude);
    //updateMap(latitude, longitude);

}

function addButtonListeners() {
    const weatherButton = document.getElementById('fetchWeatherBtn');
    weatherButton.addEventListener('click', getInputLocationAndFetch);

    const locationButton = document.getElementById('currentLocationBtn');
    locationButton.addEventListener('click', getUserLocationAndFetch);
}

function makeWeatherInfoDivs() {

    // get the weather info div
    let weatherInfo = document.getElementById('weatherInfo');

    // make divs with a title and p tag for each of the openMeteoVariables
    openMeteoVariables.forEach((variable) => {

        if(variable.includes('&')){
            return;
        }

        let div = document.createElement('div');
        div.id = 'variable-' + variable;
        let title = document.createElement('h3');
        title.textContent = variable;
        let p = document.createElement('p');
        p.id = variable;

        div.appendChild(title);
        div.appendChild(p);

        weatherInfo.appendChild(div);
    });
}




function makeRNBODeviceDivs() {
    let rnboDevice = document.getElementById('rnbo-device');

    let div = document.createElement('div');
    div.id = 'play-button';

    let button = document.createElement('button');
    button.textContent = 'Play';
    button.addEventListener('click', () => {
        
        if (button.textContent === 'Play') {

            if(device && context) {
                device.parametersById.get('rnbo-toggleclock').value = 1;
                button.textContent = 'Stop';
            } else {
                console.log('Device not ready');
            }

        } else {
            device.parametersById.get('rnbo-toggleclock').value = 0;
            button.textContent = 'Play';
        }
    });

    div.appendChild(button);
    rnboDevice.appendChild(div);
}

// We can't await here because it's top level, so we have to check later
// if device and context have been assigned
setupRNBO();


// main
try {

    makeWeatherInfoDivs();

    makeRNBODeviceDivs();

    addButtonListeners();
         
} catch (error) {
    console.error('Main Loop error!' + error);
}






























