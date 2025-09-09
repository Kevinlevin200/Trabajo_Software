// index.js
const inquirer = require("inquirer");

async function mostrarMenu() {
  const { opcion } = await inquirer.prompt([
    {
      type: "list",
      name: "opcion",
      message: "Selecciona una opción:",
      choices: [
        "Agregar evento",
        "Ver eventos próximos",
        "Calcular días restantes para un evento",
        "Salir",
      ],
    },
  ]);

  switch (opcion) {
    case "Agregar evento":
      console.log("👉 Aquí va la lógica para agregar evento");
      break;
    case "Ver eventos próximos":
      console.log("👉 Aquí va la lógica para listar eventos");
      break;
    case "Calcular días restantes para un evento":
      console.log("👉 Aquí va la lógica para calcular días");
      break;
    case "Salir":
      console.log("👋 Saliendo...");
      return;
  }

  await mostrarMenu(); // vuelve al menú
}

mostrarMenu();
