# Weather Music

This project is a work in progress. The goal is to make a project that maps 'real-time' weather data to audio parameters that generate music. As the weather changes, so will the music. 

## How it works

You can use your current location or input coordinates to fetch the current weather data. This uses open-meteo, a free open-source weather API. 
For more information  visit [open-meteo](https://open-meteo.com/). The data is sent to a RNBO device that updates it's setting based off of the given input. Then you hear sounds. see Data Mapping below.

## How to Use

1. Enter a location in the input field and click "Fetch Weather" or click "Use Current Location" to get the weather for your current location.
2. View the weather information displayed on the page.
3. Listen to the sounds generated from the weather data.

## How to Build
WIP


## Note

This project is a work in progress.  

## TODO: 
- map weather to audio parameters
- finish building rnbo patch
- Connnect weather data to rnbo patch
- add geocoding to add search by name of location functioanlity [geocoding api](https://open-meteo.com/en/docs/geocoding-api)
- fix google maps integration 
- Add auto-refresh (by minute? or hour? or day?) Open-Meteo has a limit of 10,000 calls per day.

## Data Mapping
The weather data is mapped to RNBO parameters. Inside RNBO are mutliple patches that receive the input values and change the audio.

| Weather Types | Data Traits                                                                 |
|---------------|-----------------------------------------------------------------------------|
| sunny         | - High temperature<br>- Low dew point<br>- No precipitation<br>- High atmospheric pressure |
| rainy         | - Moderate to high precipitation<br>- Moderate to high humidity<br>- Low atmospheric pressure<br>- Cooler temperature |
| windy         | - High wind speed<br>- Variable wind direction<br>- Moderate temperature changes<br>- Possible low pressure |
| stormy        | - Very high precipitation<br>- High wind speed<br>- Low atmospheric pressure<br>- Thunder and lightning presence |
| cloudy        | - Overcast conditions<br>- Potential for cooler temperature<br>- Moderate humidity<br>- Possible light precipitation |


---
---

| Weather Variables |  RNBO Parameters |
|-------------------|----------------|
| Rain amount (mm/hr)| RainSynth<br>- Trigger Rate<br>- Frequency<br>- ADSR<br>- Note Length(ms)<br>- OutputGain
| Wind Speed (km/h) | tbd
| Wind Direction (deg)| tbd
| Temperature (C)  | tbd 
| Humidity (%)   | tbd
| Day or Night (1or0) | tbd
| Surface Pressure (hPa) | tbd

---
---

| Max Patches | Description
|-------------|------------|
| RainSynth   | 2 voice sine wave synth arpeggiator. Each clock cycle triggers the following:<br>- Randomly chooses frequency multiplier of each osc.<br>- Randomly delays ADSR note on.<br>- Randomly chooses to trigger the left or right osc.
| HeatSynth  | Need to build. Could be for temperature, humidity, maybe pressure as well? 
| WindSynth  | Need to build. Would be for windspeed, and winddirection.