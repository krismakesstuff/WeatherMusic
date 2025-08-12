# Weather Music

An interactive web application that transforms real-time weather data into generative ambient music. Explore weather patterns around the world through sound - as the weather changes, so does the music. Use the interactive map to select locations and hear how different weather conditions create unique soundscapes.

#### This project is still in progress. The UI and map are functional, but the synth still needs to be completed.

## How it works

The app fetches real-time weather data from [Open-Meteo](https://open-meteo.com/), a free open-source weather API. Weather parameters are mapped to synthesizer controls in a RNBO device that generates ambient audio in real-time. The map displays both satellite imagery and live precipitation radar data.

## Features

- **Interactive Map**: Click anywhere on the map to fetch weather data for that location
- **Real-time Weather**: Current weather conditions including temperature, precipitation, wind, and atmospheric pressure
- **Live Radar**: Precipitation overlay showing real-time rain patterns
- **Generative Music**: Weather data drives synthesizer parameters for unique ambient soundscapes
- **Multiple Views**: Switch between satellite and street map views

## How to Use

1. Use the map to navigate to any location worldwide
2. Click "Fetch Weather" to get current weather data for the map center
3. Or click "Current Location" to use your GPS coordinates
4. View detailed weather information in the overlay panel
5. Listen as the weather data generates unique ambient sounds
6. Use the audio controls to play/stop and adjust volume

## Development

Built with React, TypeScript, and Vite. Uses Leaflet for mapping and RNBO for audio synthesis.

### Setup
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
```

### Deploy to GitHub Pages
```bash
npm run deploy
```

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Mapping**: Leaflet.js with React-Leaflet
- **Weather API**: Open-Meteo
- **Audio**: RNBO (Max/MSP export)
- **Radar Data**: RainViewer API

## Current Status

The application is functional with core features implemented. Audio synthesis responds to weather parameters in real-time.

## TODO

- Map additional weather parameters to audio synthesis
- Expand synthesizer patches for different weather types
- Complete sound design of weather parameters

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
