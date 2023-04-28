import axios from "axios";
import { metricsFnWrapper } from "../utils/metrics.js";

export const factController = async (req, res) => {
  try {
    const fact = await getFact();
    res.status(200).send(fact);
  } catch (error) {
    res.status(502).send("El dato no llegó correctamente");
  }
};

async function getFact() {
  const response = await metricsFnWrapper(
    "fact-provider",
    async () =>
      await axios.get("https://uselessfacts.jsph.pl/api/v2/facts/random")
  );
  const fact = response.data.text;
  return fact;
}
