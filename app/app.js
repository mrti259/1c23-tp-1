import { nanoid } from "nanoid";
import express from "express";

const id = nanoid();
const app = express();
const PORT = 3000;

app.use((req, res, next) => {
	res.setHeader("X-API-Id", id);
	next();
});

app.get("/ping", (req, res) => {
	res.send("OK");
});

app.get("/metar", (req, res) => {
	const { station } = req.query;
	res.send(station);
});

app.get("/space_news", (req, res) => {
	const titles = [];
	res.send(titles);
});

app.get("/fact", (req, res) => {
	const fact = "";
	res.send(fact);
});

app.listen(PORT, () => {
	console.log(`Escuchando en el puerto ${PORT}`);
});
