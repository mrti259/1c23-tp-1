import { nanoid } from "nanoid";

const containerId = nanoid();

export const pingPongController = (req, res) => {
  console.log(`OK from container: ${containerId}`);
  res.status(200).send(`OK - ${containerId}`);
};
