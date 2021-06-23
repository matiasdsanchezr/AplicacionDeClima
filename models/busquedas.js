const fs = require("fs");

const axios = require("axios");
require("dotenv").config();

dbPath = "./db";
dbName = "database.json";

class Busquedas {
	searchHistory = [];

	constructor() {
		this.loadFromDB();
	}

	getCapitalizedSearchHistory() {
		return this.searchHistory.map((place) => {
			let words = place.split(" ");
			words = words.map((word) => word[0].toUpperCase() + word.substring(1));
			return words.join(" ");
		});
	}

	async searchPlaces(place = "") {
		try {
			const instance = axios.create({
				baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
				params: {
					access_token: process.env.MAPBOX_KEY,
					//types: "address%2Ccountry%2Cneighborhood%2Cregion%2Cdistrict%2Cpostcode%2Clocality%2Cplace",
					limit: 5,
					language: "es",
				},
			});

			const response = await instance.get();

			return response.data.features.map((p) => ({
				id: p.id,
				name: p.place_name,
				lng: p.center[0],
				lat: p.center[1],
			}));
		} catch (error) {
			console.log(error);
			return [];
		}
	}

	async searchPlaceWeather(lat, lon) {
		try {
			const instance = axios.create({
				baseURL: `https://api.openweathermap.org/data/2.5/weather`,
				params: {
					lat: lat,
					lon: lon,
					appid: process.env.OPENWEATHER_KEY,
					units: "metric",
					lang: "es",
				},
			});

			const response = await instance.get();
			const { weather, main } = response.data;
			return {
				desc: weather[0].description,
				min: main.temp_min,
				max: main.temp_max,
				temp: main.temp,
			};
		} catch (error) {
			console.log("Error al obtener informacion de OpenWeatherMap");
			return [];
		}
	}

	addToSearchHistory(lugar = "") {
		// Prevenir duplicados
		if (this.searchHistory.includes(lugar.toLocaleLowerCase())) {
			return;
		}

		// Limitar la cantidad de lugares en el historial
		this.searchHistory = this.searchHistory.splice(0, 5);

		this.searchHistory.unshift(lugar.toLocaleLowerCase());

		//Guardar en DB
		this.saveToDB();
	}

	saveToDB() {
		const payload = {
			searchHistory: this.searchHistory,
		};
		fs.writeFileSync(`${dbPath}/${dbName}`, JSON.stringify(payload));
	}

	loadFromDB() {
		if (!fs.existsSync(`${dbPath}/${dbName}`)) {
			// Comprobar si el directorio existe
			if (!fs.existsSync(dbPath)) {
				//Crear el directorio si no existe
				fs.mkdir(dbPath, (err) => {
					if (err) return console.error(err);
				});
			}
			return null;
		}

		const json = fs.readFileSync(`${dbPath}/${dbName}`, { encoding: "utf8" });
		const data = JSON.parse(json);

		this.searchHistory = data.searchHistory;
	}
}

module.exports = Busquedas;
