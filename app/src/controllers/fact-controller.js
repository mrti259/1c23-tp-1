import axios from "axios";
import { metricsFnWrapper } from "../utils/metrics.js";

export const factController = async (req, res) => {
  try {
    const fact = await getFact();
    res.status(200).send(fact.data.text);
  } catch (error) {
    res.status(502).send("El dato no llegó correctamente");
  }
};

const getFact = () => {
  return metricsFnWrapper("fact-provider", async () => {
    const fact = await axios.get(
      "https://uselessfacts.jsph.pl/api/v2/facts/random"
    );
    return fact;
  });
};
