const chalk = require("chalk");

const { mainMenu, readInput, pause, listPlaces } = require("./helpers/inquirer");
const clearConsole = require("./helpers/console");
const Busquedas = require("./models/busquedas");

const main = async () => {
	const busquedas = new Busquedas();
	let opt = 1;

	do {
		// Esperar el input del menu principal
		opt = await mainMenu();

		switch (opt) {
			case 1:
				// Leer el lugar ingresado
				const input = await readInput("Ubicación: ");
				// Buscar el lugar ingresado con MapBox
				const places = await busquedas.searchPlaces(input);
				// Mostrar resultados de la busqueda
				const placeId = await listPlaces(places);
				if (placeId == 0) continue;
				// Crear objeto con usando el ID del lugar seleccionado
				const selectedPlace = places.find((place) => place.id === placeId);
				// Guardar en DB
				busquedas.addToSearchHistory(selectedPlace.name);
				// Buscar la temperatura del lugar con OpenWeatherMap
				const result = await busquedas.searchPlaceWeather(selectedPlace.lat, selectedPlace.lng);
				result.desc = result.desc[0].toUpperCase() + result.desc.substring(1);

				// Mostrar resultados
				console.log(chalk.bold.underline("\nInformación de la ubicación:\n"));
				console.log(chalk.bold("Nombre: "), chalk.yellow(selectedPlace.name));
				console.log(chalk.bold("Lat: "), chalk.yellow(selectedPlace.lat));
				console.log(chalk.bold("Lon: "), chalk.yellow(selectedPlace.lng));
				console.log(chalk.bold("Temperatura: "), chalk.yellow(`${result.temp}ºc`));
				console.log(chalk.bold("Mínima: "), chalk.yellow(`${result.min}ºc`));
				console.log(chalk.bold("Máxima: "), chalk.yellow(`${result.max}ºc`));
				console.log(chalk.bold("Descripción: "), chalk.yellow(result.desc));

				break;
			case 2:
				// Mostrar historial de busqueda
				busquedas.getCapitalizedSearchHistory().forEach((place, i) => {
					const idx = `${i + 1}.`.green;
					console.log(`${idx} ${place}`);
				});
				break;
		}
		if (opt !== 0) await pause();
		clearConsole;
	} while (opt !== 0);

	clearConsole();
};

main();
