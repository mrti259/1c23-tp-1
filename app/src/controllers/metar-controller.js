import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { decode } from "metar-decoder";
import { metricsFnWrapper } from "../utils/metrics.js";
import { cache } from "../utils/cache.js";

const CACHE_BASE_KEY = "metar-";
const CACHE_TTL = 10; // 10 seconds

export const metarController = async (req, res) => {
  const station = req.query.station;
  const useCache = req.query.cache === "true";
  console.log("useCache: ", useCache);
  console.log("station: ", station);
  if (station === undefined) {
    res.status(400).send("El usuario no ingresó un aeropuerto");
    return;
  }
  try {
    const metar = useCache
      ? await getMetarWithCache(station)
      : await getMetar(station);
    res.status(200).send(metar);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getMetar = async (station) => {
  const response = await tryGetStationData(station);
  const parsed = tryParse(response.data);

  const metarToDecode = parsed?.response?.data?.METAR?.raw_text;
  if (!metarToDecode) throw new Error("Código de aeropuerto inválido");

  const metar = tryDecodeMetar(metarToDecode);
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

const getMetarWithCache = async (station) => {
  const cachedMetar = await getCache(station);
  if (cachedMetar) {
    console.log("Cache hit");
    return cachedMetar;
  }
  console.log("Cache miss");
  const metar = await getMetar(station);
  setCache(station, metar);
  return metar;
};

const getCacheKey = (station) => `${CACHE_BASE_KEY}${station.toLowerCase()}`;

const setCache = (station, value) => {
  return cache.set(getCacheKey(station), JSON.stringify(value), {
    EX: CACHE_TTL,
  });
};

const getCache = async (station) => {
  const value = await cache.get(getCacheKey(station));
  return value ? JSON.parse(value) : null;
};
