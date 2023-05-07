import axios from "axios";
import { metricsFnWrapper } from "../utils/metrics.js";
import { XMLParser } from "fast-xml-parser";
import { decode } from "metar-decoder";

export const metarController = async (req, res) => {
  const station = req.query.station;
  if (station === undefined) {
    res.status(400).send("El usuario no ingresó un aeropuerto");
    return;
  }
  try {
    const metar = await getMetar(station);
    res.status(200).send(metar);
  } catch (error) {
    res.status(502).send(error.message);
  }
};

const getMetar = async (station) => {
  const response = await tryGetStationData(station);
  const parsed = tryParse(response.data);
  const metar = tryDecodeMetar(parsed.response.data.METAR.raw_text);
  return metar;
};

const tryGetStationData = async (station) => {
  try {
    return await metricsFnWrapper(
      "metar-provider",
      async () =>
        await axios.get(
          `https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=${station}&hoursBeforeNow=1`
        )
    );
  } catch (error) {
    console.log(error.message);
    throw new Error("Error al obtener la información");
  }
};

const tryParse = (data) => {
  try {
    return new XMLParser().parse(data);
  } catch (error) {
    console.log(error.message);
    throw new Error("Error al parsear la información");
  }
};

const tryDecodeMetar = (text) => {
  try {
    return decode(text);
  } catch (error) {
    console.log(error.message);
    throw new Error("Error al decodificar la información");
  }
};
