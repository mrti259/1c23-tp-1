import { nanoid } from "nanoid";
import express from "express";
import axios from "axios";

const id = nanoid();
const app = express();
const PORT = 3000;

app.use((req, res, next) => {
	res.setHeader("X-API-Id", id);
	next();
});

app.get("/ping", (req, res) => {
	res.status(200).send("OK");
});

app.get("/metar", async (req, res) => {
	console.log(req.query)
	const station = req.query.station;
	let response = await axios.get(`https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=${station}&hoursBeforeNow=1`)
	res.status(200).send(response.data);
});

app.get("/space_news", async (req, res) => {
	const titles = [];
	try {
		let news = await axios.get("https://api.spaceflightnewsapi.net/v3/articles?_limit=5");
		news.data.forEach(article => {
			titles.push(article.title)
		})
		res.send(titles);
	} catch(error){
		res.send("Las noticias no llegaron correctamente") // No se si manejar el error así y acá
	}
});

app.get("/fact", async (req, res) => {
	try {
		let fact = await axios.get("https://uselessfacts.jsph.pl/api/v2/facts/random")
		res.status(200).send(fact.data.text);
	} catch(error){
		res.send("El dato no llegó correctamente") // No se si manejar el error así y acá
	}

});
app.listen(PORT, () => {
	console.log(`Escuchando en el puerto ${PORT}`);
});
