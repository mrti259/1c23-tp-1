import axios from "axios";
import { metricsFnWrapper } from "../utils/metrics.js";
import { XMLParser } from "fast-xml-parser";
import { decode } from "metar-decoder";

const parser = new XMLParser();

export const metarController = async (req, res) => {
  const { station } = req.query;
  if (!station) {
    res.status(400).send("El usuario no ingresó un aeropuerto");
    return;
  }
  try {
    const metar = await getMetar(station);
    res.status(200).send(metar);
  } catch (error) {
    res.status(502).send("La información del aeropuerto no llegó");
  }
};

async function getMetar(station) {
  const response = await metricsFnWrapper(
    "metar-provider",
    async () =>
      await axios.get(
        `https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=${station}&hoursBeforeNow=1`
      )
  );
  const parsed = parser.parse(response.data);
  const metar = decode(parsed.response.data.METAR.raw_text);
  return metar;
}
