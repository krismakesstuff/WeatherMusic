export const openMeteoVariables = [
  "&current=",
  "temperature_2m",
  "temperature_80m",
  "dew_point_2m",
  "precipitation_probability",
  "precipitation",
  "rain",
  "snowfall",
  "snow_depth",
  "pressure_msl",
  "surface_pressure",
  "cloud_cover",
  "wind_speed_10m",
  "wind_direction_10m",
];

interface DataPointProps {
  [id: string]: string | number;
}

function DataPoint(props: DataPointProps) {
  return (
    <div className="p-2 m-2 rounded-lg bg-slate-800 ">
      {props.id}: {props.value}
    </div>
  );
}

interface WeatherInfoProps {
  className: string;
  data: {
    [key: string]: {
      [key: string]: string | number;
    };
  };
}

export function WeatherInfo(props: WeatherInfoProps) {
  if ("current" in props.data) {
    console.log("Building Weather Info Data: ", props.data);

    function renderDataPoints() {
      return Object.entries(props.data["current"]).map(([id, value]) => {
        return <DataPoint key={id} id={id} value={value} />;
      });
    }

    return (
      <div className={props.className}>
        Weather Info:
        <div className="flex flex-wrap justify-center">{renderDataPoints()}</div>
      </div>
    );
  } else {
    return (
      <div className={props.className}>
        <h2 className="">Weather Info</h2>
        <p>No Data Available</p>
      </div>
    );
  }
}
