//import { MapsAPIKey } from "./credentials.js";
// import { Loader } from 'google.maps.plugins.loader.Loader';

let openMeteoVariables = ['&current=temperature_2m', 'relative_humidity_2m', 'is_day', 'rain', 'showers', 'snowfall', 'surface_pressure', 'wind_speed_10m', 'wind_direction_10m'];

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

    let openMeteoAPI = 'https://api.open-meteo.com/v1/forecast?' + latitude + longitude + openMeteoVariables.join(',');

    fetch(openMeteoAPI)
      .then(response => response.json())
      .then(data => {
        console.log(data)
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

        // update the HTML 
        document.getElementById('&current=temperature_2m').textContent = currentTemp + ' ' + tempUnit;
        document.getElementById('rain').textContent = currentRain + ' ' + rainUnit;
        document.getElementById('relative_humidity_2m').textContent = currentHumidity + ' ' + humidityUnit;
        document.getElementById('wind_speed_10m').textContent = currentWindSpeed + ' ' + windSpeedUnit;
        document.getElementById('wind_direction_10m').textContent = currentWindDirection + ' ' + windDirectionUnit;
        document.getElementById('surface_pressure').textContent = currentSurfacePressure + ' ' + surfacePressureUnit;

        // update the location input 
        document.getElementById('locationInput').value = lat + ', ' + long;
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

// main
try {

    makeWeatherInfoDivs();
    addButtonListeners();

    //getUserLocationAndFetch()
    //loadMapsAPILibrary();
    //initMap();
         
} catch (error) {
    console.error(error);
}






























