# Weather Music

This project is a work in progress and actively being worked. The goal is to map 'real-time' weather data to  parameters that generate ambient synth sounds (music?). As the weather changes, so will the generated sounds. Click around the map to choose locations to get real-time weather data and hear the synth generate new sounds.

## How it works

Use your current location or input coordinates to fetch the current weather data. This uses [open-meteo](https://open-meteo.com/), a free open-source weather API. The weather data is sent to a RNBO device that generates synthesized sound. See Data Mapping below.

## How to Use

1. Enter a location in the input field and click "Fetch Weather" or click "Use Current Location" to get the weather for your current location.
2. View the weather information displayed on the page.
3. Listen to the sounds generated from the weather data.

## How to Build
WIP.

The project is React App built with Vite. 

```npm install```
<br>
```tailwind init?```


currently using [leafletjs](https://leafletjs.com/reference.html) as the map. 

## Note

This project is a work in progress. The gh-pages deployment is not loading the rnbo device currently. Need to fix configuration. Working great locally, otherwise.

## TODO: 
- fix gh-pages deployment: not loading rnb0-device. Check gh-pages config
- map remaining weather data to audio parameters
  - look into using weather codes for simplification. 
- finish synths
- move rnboDevice into it's own react component?
- add geocoding to add search by name of location functioanlity [geocoding api](https://open-meteo.com/en/docs/geocoding-api)
  - add cities list in the meantime
- Add auto-refresh (by minute? or hour? or day?) Open-Meteo has a limit of 10,000 calls per day.

## Data Mapping
The weather data is mapped to RNBO parameters. Inside RNBO are mutliple patches that receive the input values and change the audio.

| Code | Description|
|-------------------------|---------------|
| 0 |	Clear sky
| 1, 2, 3 |	Mainly clear, partly cloudy, and overcast
| 45, 48 | Fog and depositing rime fog
| 51, 53, 55 | Drizzle: Light, moderate, and dense intensity
| 56, 57 | Freezing Drizzle: Light and dense intensity
| 61, 63, 65 | Rain: Slight, moderate and heavy intensity
| 66, 67 | Freezing Rain: Light and heavy intensity
| 71, 73, 75 | Snow fall: Slight, moderate, and heavy intensity
| 77 | Snow grains
| 80, 81, 82 | Rain showers: Slight, moderate, and violent
| 85, 86 | Snow showers slight and heavy
| 95 *	|Thunderstorm: Slight or moderate
| 96, 99 * | Thunderstorm with slight and heavy hail

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
| Rain amount (mm/hr)| RainSynth<br>- Trigger Rate<br>- Frequency<br>- ADSR<br>- Note Length(ms)<br>- OutputGain<br>- Noise Gain
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
| RainSynth   | 4 OSCs: 2 sine, 2 saw, each channel has dedicated saw and sine OSCs. There is noise stage that is applied to both channels equally. After that, a delay and filter. Each "clock input" triggers random numbers for the following parameters:<br>- frequency multiplier for each channel's OSCs.<br>- delay time for ADSR note on.<br>-  left or right channel to trigger note on.
| HeatSynth  | Need to build. Could be for temperature, humidity, maybe pressure as well? 
| WindSynth  | Need to build. Would be for windspeed, and winddirection.
| EarthTone | Single sine wave at 64hz. 