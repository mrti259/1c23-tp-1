import axios from "axios";
import { cache } from "../utils/cache.js";
import { metricsFnWrapper } from "../utils/metrics.js";

const PROVIDER_ENDPOINT = "https://uselessfacts.jsph.pl/api/v2/facts/random";
const FACT_CACHE_KEY = "facts";
const DEFAULT_CACHE_FILL_AMOUNT = 30;

export const factController = async (req, res) => {
  const useCache = req.query.cache === "true";
  const cacheFillAmount =
    req.query.cacheFillAmount || DEFAULT_CACHE_FILL_AMOUNT;
  let fact;
  try {
    fact = useCache
      ? await getFactCached(cacheFillAmount)
      : await getFactWithoutCache();
  } catch (error) {
    return res.status(502).send("El dato no llegó correctamente");
  }
  res.status(200).send(fact);
};

const getFactWithoutCache = async () => {
  const fact = await getFact();
  return fact.data.text;
};

const getFactCached = async (cacheFillAmount) => {
  let fact = await cache.rPop(FACT_CACHE_KEY);
  console.log("Fact obtenido de cache", fact);

  if (!fact) {
    const factRes = await getFact();
    fact = factRes.data.text;
    fillCache(cacheFillAmount); // Llenar cache con N facts
  }

  return fact;
};

const fillCache = async (amount) => {
  console.log("Llenando cache de facts...");
  for (let i = 0; i < amount; i++) {
    const fact = await getFact();
    await cache.lPush(FACT_CACHE_KEY, fact.data.text);
  }
  console.log("Cache de facts llenado");
};

const getFact = () => {
  return metricsFnWrapper("fact-provider", async () => {
    const fact = await axios.get(PROVIDER_ENDPOINT);
    return fact;
  });
};
