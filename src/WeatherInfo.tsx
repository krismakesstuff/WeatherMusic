
interface WeatherInfoProps {
    data: any;
}

export default function WeatherInfo(props: WeatherInfoProps) {

    if(props.data) {

    const currentTemp = props.data.current.temperature_2m;
    const tempUnit = props.data.current_units.temperature_2m;
    const currentRain = props.data.current.rain;
    const rainUnit = props.data.current_units.rain;
    const currentHumidity = props.data.current.relative_humidity_2m;
    const humidityUnit = props.data.current_units.relative_humidity_2m; 
    const currentWindSpeed = props.data.current.wind_speed_10m;  

    return(
        <>
        <h2 className="">Weather Info</h2>
        <p>Temperature: {props.data.current.temperature_2m}°C</p>

        </>
    );
} else {
    return (
        <div className="">
            <h2 className="">Weather Info</h2>
            <p>Temperature: No Data Available</p>
        </div>
    );

}