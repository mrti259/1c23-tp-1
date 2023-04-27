import axios from "axios";
import { metricsFnWrapper } from "../utils/metrics.js";

export const metarController = async (req, res) => {
  const station = req.query.station;
  if (station === undefined) {
    res.status(400).send("El usuario no ingresó un aeropuerto");
    return;
  }
  try {
    const response = await getMetar(station);
    res.status(200).send(response.data);
  } catch (error) {
    res.status(502).send("La información del aeropuerto no llegó");
  }
};

const getMetar = (station) => {
  return metricsFnWrapper("metar-provider", async () => {
    const response = await axios.get(
      `https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=${station}&hoursBeforeNow=1`
    );
    return response;
  });
};
