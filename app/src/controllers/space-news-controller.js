import axios from "axios";
import { metricsFnWrapper } from "../utils/metrics.js";

export const spaceNewsController = async (req, res) => {
  try {
    const titles = await getSpaceNews();
    res.status(200).send(titles);
  } catch (error) {
    res.status(502).send("Las noticias no llegaron correctamente");
  }
};

async function getSpaceNews() {
  const response = await metricsFnWrapper(
    "space-news-provider",
    async () =>
      await axios.get("https://api.spaceflightnewsapi.net/v3/articles?_limit=5")
  );
  const titles = response.data
    .filter((article) => article.hasOwnProperty("title"))
    .map((article) => article.title);
  return titles;
}
