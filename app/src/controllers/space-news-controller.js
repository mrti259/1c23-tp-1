import axios from "axios";
import { metricsFnWrapper } from "../utils/metrics.js";
import { cache } from "../utils/cache.js";

const PROVIDER_ENDPOINT =
  "https://api.spaceflightnewsapi.net/v3/articles?_limit=5";

const CACHE_KEY = "space_news";
const CACHE_TTL = 10; // 10 seconds

export const spaceNewsController = async (req, res) => {
  const useCache = req.query.cache === "true";
  let titles = [];
  try {
    titles = useCache
      ? await getSpaceNewsTitlesWithCache()
      : await getSpaceNewsTitles();
  } catch (error) {
    return res.status(502).send("Las noticias no llegaron correctamente");
  }
  res.status(200).send(titles);
};

const getSpaceNewsFromProvider = () => {
  return metricsFnWrapper("space-news-provider", async () => {
    const news = await axios.get(PROVIDER_ENDPOINT);
    return news;
  });
};

const getSpaceNewsTitles = async () => {
  const news = await getSpaceNewsFromProvider();
  const titles = [];
  news.data.forEach((article) => {
    titles.push(article.title);
  });
  return titles;
};

const getSpaceNewsTitlesWithCache = async () => {
  const cachedNews = await getCache();
  if (cachedNews) {
    console.log("Cache hit");
    return cachedNews;
  }
  console.log("Cache miss");
  const titles = await getSpaceNewsTitles();
  setCache(titles);
  return titles;
};

const setCache = (value) => {
  return cache.set(CACHE_KEY, JSON.stringify(value), {
    EX: CACHE_TTL,
  });
};

const getCache = async () => {
  const value = await cache.get(CACHE_KEY);
  return value ? JSON.parse(value) : null;
};
