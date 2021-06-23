const inquirer = require("inquirer");
require("colors");

const clearConsole = require("./console");

// Opciones del menu principal
const menuQuestion = [
	{
		type: "list",
		name: "option",
		message: "¿Que desea hacer?",
		pageSize: 10,
		choices: [
			{
				value: 1,
				name: `${"1".bold.green}. Buscar una ubicación`,
			},
			{
				value: 2,
				name: `${"2".bold.green}. Busquedas recientes`,
			},
			{
				value: 0,
				name: `${"0".bold.green}. Salir\n`,
			},
		],
	},
];

// Menu usando inquirer. Retorna la opcion seleccionada
const mainMenu = async () => {
	clearConsole();

	console.log("===============================".green);
	console.log("     Selecciona una opcion".white);
	console.log("===============================\n".green);

	const { option } = await inquirer.prompt(menuQuestion);

	return option;
};

// Pausar la aplicacion
const pause = async () => {
	console.log("\n");

	const question = [
		{
			type: "input",
			name: "input",
			message: `Presione ${"Enter".green} para continuar.`,
		},
	];

	return await inquirer.prompt(question);
};

// Mostrar un mensaje y retornar el input
const readInput = async (message) => {
	const question = [
		{
			type: "input",
			name: "desc",
			message,
			validate(value) {
				if (value.length === 0) {
					return "Por favor ingrese un valor.";
				}
				return true;
			},
		},
	];

	const { desc } = await inquirer.prompt(question);
	return desc;
};

// Listar lugares y retornar el id del lugar seleccionado
const listPlaces = async (places = []) => {
	const choices = places.map((place, i) => {
		const idx = `${i + 1}`.green;

		return {
			value: place.id,
			name: `${idx} ${place.name}`,
		};
	});
	choices.unshift({ value: 0, name: `${"0".green} Cancelar` });

	const questions = [
		{
			type: "list",
			name: "id",
			message: "Seleccionar ubicación:",
			choices,
		},
	];
	
	const { id } = await inquirer.prompt(questions);
	return id;
};

// Mensaje de confirmacion
const confirm = async (message) => {
	const question = [
		{
			type: "confirm",
			name: "ok",
			message,
		},
	];

	const { ok } = await inquirer.prompt(question);
	return ok;
};

module.exports = {
	mainMenu,
	pause,
	readInput,
	listPlaces,
	confirm,
};
