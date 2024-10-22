# Weather Music

This project is a work in progress.

## Overview

Weather Music is a web application that allows you to listen to music derived from the current weather. You can use your current location or search for any location to get the weather information. This uses open-meteo, a free, open-source weather API. 

For more information about the weather API used in this project, visit [open-meteo](https://open-meteo.com/).


## How to Use

1. Enter a location in the input field and click "Fetch Weather" or click "Use Current Location" to get the weather for your current location.
2. View the weather information displayed on the page.
3. Listen to the sounds generated from the weather data.

## How to Build
1. make credentials.js file with the following code ```export const MapsAPIKey = 'YOUR_API_KEY';``` Replacing YOUR_API_KEY with your own google maps API key. See [Google Cloud](https://console.cloud.google.com/) to get your own API key. 

## Note

This project is a work in progress.  

### TODO: 
- add geocoding to add search by name of location functioanlity [geocoding api](https://open-meteo.com/en/docs/geocoding-api)
- fix google maps integration 
- finish building rnbo patch
- Connnect weather data to rnbo patch