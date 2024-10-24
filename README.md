# Weather Music

This project is a work in progress. The goal is to make a project that maps 'real-time' weather data to audio parameters that generate music. As the weather changes, so will the music. 

## How it works

Weather Music is a web application that allows you to listen to music derived from the current weather. You can use your current location or search for any location to get the weather information. This uses open-meteo, a free, open-source weather API. 

For more information about the weather API used in this project, visit [open-meteo](https://open-meteo.com/).

## How to Use

1. Enter a location in the input field and click "Fetch Weather" or click "Use Current Location" to get the weather for your current location.
2. View the weather information displayed on the page.
3. Listen to the sounds generated from the weather data.

## How to Build
WIP

## Data Mapping
The weather data is mapped to audio and music parameters, which are then sent to RNBO. Which triggers a collection of samples, synthesizers, and filters to generate sound. 
<br>
![Data Map](/WeatherMusic%20Data%20to%20Note%20Map.png)




## Note

This project is a work in progress.  

### TODO: 
- map weather to audio parameters
- finish building rnbo patch
- Connnect weather data to rnbo patch
- add geocoding to add search by name of location functioanlity [geocoding api](https://open-meteo.com/en/docs/geocoding-api)
- fix google maps integration 
- Add auto-refresh (by minute? or hour? or day?) Open-Meteo has a limit of 10,000 calls per day.


#### Mapping notes
| Weather Types | Data Traits                                                                 | Audio Parameters |
|---------------|-----------------------------------------------------------------------------|------------------|
| sunny         | - High temperature<br>- Low dew point<br>- No precipitation<br>- High atmospheric pressure |                  |
| rainy         | - Moderate to high precipitation<br>- Moderate to high humidity<br>- Low atmospheric pressure<br>- Cooler temperature |                  |
| windy         | - High wind speed<br>- Variable wind direction<br>- Moderate temperature changes<br>- Possible low pressure |                  |
| stormy        | - Very high precipitation<br>- High wind speed<br>- Low atmospheric pressure<br>- Thunder and lightning presence |                  |
| cloudy        | - Overcast conditions<br>- Potential for cooler temperature<br>- Moderate humidity<br>- Possible light precipitation |                  |