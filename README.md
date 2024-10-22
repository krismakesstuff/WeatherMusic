# Weather Music

This project is a work in progress.

## Overview

Weather Music is a web application that allows you to listen to music derived from the current weather. You can use your current location or search for any location to get the weather information. This uses open-meteo, a free, open-source weather API. 

For more information about the weather API used in this project, visit [open-meteo](https://open-meteo.com/).


## Features

- Fetch weather information for the current location or a specified location.
- Display temperature, rain, and location information.

## How to Use

1. Enter a location in the input field and click "Fetch Weather" or click "Use Current Location" to get the weather for your current location.
2. View the weather information displayed on the page.

## How to Build
1. make credentials.js file with the following code ```export const MapsAPIKey = 'YOUR_API_KEY';``` Replacing YOUR_API_KEY with your own google maps api. See [Google Cloud](https://console.cloud.google.com/) to get your own API key. 

## Note

This project is a work in progress.  

### TODO: 
- add geocoding to add search by name of location functioanlity [geocoding api](https://open-meteo.com/en/docs/geocoding-api)
- fix update map function. Only working when using device location. 
- Build and export rnbo patch
- Connnect weather data to rnbo patch