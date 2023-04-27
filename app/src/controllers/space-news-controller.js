import axios from "axios";
import { metricsFnWrapper } from "../utils/metrics.js";

export const spaceNewsController = async (req, res) => {
  const titles = [];
  try {
    const news = await getSpaceNews();
    news.data.forEach((article) => {
      titles.push(article.title);
    });
  } catch (error) {
    res.status(502).send("Las noticias no llegaron correctamente");
  }
  res.status(200).send(titles);
};

const getSpaceNews = () => {
  return metricsFnWrapper("space-news-provider", async () => {
    const news = await axios.get(
      "https://api.spaceflightnewsapi.net/v3/articles?_limit=5"
    );
    return news;
  });
};
