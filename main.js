import { MapsAPIKey } from "./credentials.js";
// import { Loader } from 'google.maps.plugins.loader.Loader';

let openMeteoVariables = '&current=temperature_2m,relative_humidity_2m,is_day,rain,wind_speed_10m';


let map;

let userLatitude;
let userLongitude;

const defaultZoom = 4;

async function loadMapsAPILibrary() {
    // Load the Google Maps JavaScript API library.
    const loader = new Loader({
        apiKey: MapsAPIKey,
        version: "weekly",
    });

    loader.importLibrary("maps")
}

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


async function fetchWeather(lat, long) {
    console.log('fetching weather for: ' + lat + ', ' + long);

    let latitude = 'latitude=' + lat;
    let longitude = 'longitude=' + long;

    let openMeteoAPI = 'https://api.open-meteo.com/v1/forecast?' + latitude + '&' + longitude + openMeteoVariables;

    fetch(openMeteoAPI)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        const currentTemp = data.current.temperature_2m;
        const currentRain = data.current.rain;
        const currentHumidity = data.current.relative_humidity_2m;
        const currentWindSpeed = data.current.wind_speed_10m;  
        
        // update the weather info elements     
        const rain = document.getElementById('rain');
        const temperature = document.getElementById('temperature');
        const location = document.getElementById('location');
        const humidity = document.getElementById('humidity');
        const windSpeed = document.getElementById('windSpeed');
        const dayornight = document.getElementById('dayornight');

        rain.textContent = `Rain: ${currentRain}mm`;
        temperature.textContent = `Temperature: ${currentTemp}°C`;
        humidity.textContent = `Humidity: ${currentHumidity}%`;
        windSpeed.textContent = `Wind Speed: ${currentWindSpeed}km/h`;
        location.textContent = `Location: ${data.latitude}, ${data.longitude}`;
        dayornight.textContent = `Day or Night: ${data.current.is_day ? dayornight.textContent = 'Day' : 'Night'}`;    

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

function setDefaultWeatherInfo() {
    const rain = document.getElementById('rain');
    const temperature = document.getElementById('temperature');
    const location = document.getElementById('location');
    const humidity = document.getElementById('humidity');
    const windSpeed = document.getElementById('windSpeed');


    rain.textContent = 'Rain: Choose a location';
    temperature.textContent = 'Temperature: ' + 'Choose a location';
    location.textContent = 'Location: ' + 'Choose a location';
    humidity.textContent = 'Humidity: ' + 'Choose a location';
    windSpeed.textContent = 'Wind Speed: ' + 'Choose a location';
}

// main
try {

    setDefaultWeatherInfo();
    addButtonListeners();

    //getUserLocationAndFetch()
    //loadMapsAPILibrary();
    //initMap();
         
} catch (error) {
    console.error(error);
}






























