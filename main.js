const { format, parseISO, isValid, isSameDay, differenceInDays } = require('date-fns');
const { es } = require('date-fns/locale');

let eventos = []

// Instancia global de readline
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function mostrarMenu() {
  console.log("\n=== GESTOR DE FECHAS ===");
  console.log("1. Agregar evento");
  console.log("2. Modificar fechas");
  console.log("3. Ver eventos por fecha");
  console.log("4. Eliminar un evento");
  console.log("5. Ver todos los eventos");
  console.log("6. Salir");
}

function preguntar(texto) {
  return new Promise((resolve) => {
    rl.question(texto, (respuesta) => resolve(respuesta));
  });
}

async function menu() {
  let continuar = true;

  while (continuar) {
    mostrarMenu();

    const opcion = await preguntar("Escriba una de las opciones: ");
    console.log("Tú elegiste la opción número:", opcion);

    switch (opcion) {
      case "1":
        await agregarEvento();
        break;
      case "2":
        await modificarFechas();
        break;
      case "3":
        await verEventosPorFecha();
        break;
      case "4":
        await eliminarEvento();
        break;
      case "5":
        await mostrarTodosLosEventos();
        break;
      case "6":
        console.log("Saliendo...");
        continuar = false;
        rl.close(); // Cerrar la instancia global
        break;
      default:
        console.error("Opción no válida");
        break;
    }
  }
}

class Evento {
  nombre;
  fecha; // Ahora será un objeto Date
  tipo;
  #precio;
  #estado;

  constructor(nombre, tipo, fecha, precio, estado) {
    // Validar nombre
    if (!nombre || nombre.trim().length === 0) {
      console.log("Nombre inválido!!");
      throw new Error("El nombre está vacío");
    } else {
      this.nombre = nombre.trim();
    }

    // Validar tipo
    if (!tipo || tipo.trim().length === 0) {
      console.log("Tipo inválido!!");
      throw new Error("No hay ese tipo de eventos");
    } else {
      this.tipo = tipo.trim();
    }

    // Validar y parsear fecha
    if (!fecha || !this.validarYParsearFecha(fecha)) {
      console.log("Fecha inválida!!");
      throw new Error("La fecha debe estar en formato YYYY-MM-DD");
    }

    // Validar precio
    if (precio < 0 || isNaN(precio)) {
      console.log("Precio inválido!!");
      throw new Error("El precio no puede ser negativo o no numérico");
    } else {
      this.#precio = precio;
    }

    // Validar estado
    if (!estado || estado.trim().length === 0) {
      console.log("Estado inválido!!");
      throw new Error("Debe asignar un estado");
    } else {
      this.#estado = estado.trim();
    }
  }

  // Método para validar y parsear fecha usando date-fns
  validarYParsearFecha(fechaString) {
    try {
      // Si ya es un objeto Date válido
      if (fechaString instanceof Date && isValid(fechaString)) {
        this.fecha = fechaString;
        return true;
      }

      // Si es string, intentar parsearlo
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      if (!regex.test(fechaString)) return false;

      const fechaParseada = parseISO(fechaString);
      if (!isValid(fechaParseada)) return false;

      this.fecha = fechaParseada;
      return true;
    } catch (error) {
      return false;
    }
  }

  // Getters para acceder a propiedades privadas
  get precio() {
    return this.#precio;
  }

  get estado() {
    return this.#estado;
  }

  // Getter para fecha formateada
  get fechaFormateada() {
    return format(this.fecha, 'dd/MM/yyyy', { locale: es });
  }

  // Getter para fecha en formato ISO (YYYY-MM-DD)
  get fechaISO() {
    return format(this.fecha, 'yyyy-MM-dd');
  }

  // Método para obtener días restantes
  get diasRestantes() {
    const hoy = new Date();
    return differenceInDays(this.fecha, hoy);
  }

  // Setters para modificar propiedades privadas
  set precio(nuevoPrecio) {
    if (nuevoPrecio >= 0 && !isNaN(nuevoPrecio)) {
      this.#precio = nuevoPrecio;
    } else {
      throw new Error("Precio inválido");
    }
  }

  set estado(nuevoEstado) {
    if (nuevoEstado && nuevoEstado.trim().length > 0) {
      this.#estado = nuevoEstado.trim();
    } else {
      throw new Error("Estado inválido");
    }
  }

  // Método para cambiar fecha
  cambiarFecha(nuevaFechaString) {
    if (this.validarYParsearFecha(nuevaFechaString)) {
      return true;
    }
    throw new Error("Fecha inválida");
  }

  // Método para mostrar información del evento
  mostrarInfo() {
    const diasRestantes = this.diasRestantes;
    let infoTiempo = "";

    if (diasRestantes > 0) {
      infoTiempo = ` (en ${diasRestantes} días)`;
    } else if (diasRestantes === 0) {
      infoTiempo = " (¡HOY!)";
    } else {
      infoTiempo = ` (hace ${Math.abs(diasRestantes)} días)`;
    }

    return `Evento: ${this.nombre} | Tipo: ${this.tipo} | Fecha: ${this.fechaFormateada}${infoTiempo} | Precio: $${this.#precio} | Estado: ${this.#estado}`;
  }
}

async function agregarEvento() {
  console.log("\n=== Inserte los siguientes datos ===");

  try {
    const nombre = await preguntar("1. Nombre del evento: ");
    const tipo = await preguntar("2. Tipo del evento: ");
    const fecha = await preguntar("3. Fecha del evento (YYYY-MM-DD): ");
    const precio = await preguntar("4. Precio en pesos del evento: ");
    const estado = await preguntar("5. Estado del evento: ");


    const nuevoEvento = new Evento(nombre, tipo, fecha, parseFloat(precio), estado);
    eventos.push(nuevoEvento);
    console.log(`\n✅ ${nuevoEvento.nombre} ha sido agregado exitosamente`);
    console.log(`   Fecha programada: ${nuevoEvento.fechaFormateada}`);

    if (nuevoEvento.diasRestantes >= 0) {
      console.log(`   Faltan ${nuevoEvento.diasRestantes} días`);
    }
  } catch (error) {
    console.log(`\n❌ Error al agregar evento: ${error.message}`);
  }
}

async function modificarFechas() {
  console.log("\n=== Modificar Fechas de Eventos ===");

  if (eventos.length === 0) {
    console.log("No hay eventos registrados.");
    return;
  }

  try {
    // Mostrar eventos disponibles
    console.log("\nEventos disponibles:");
    eventos.forEach((evento, index) => {
      console.log(`${index + 1}. ${evento.mostrarInfo()}`);
    });

    const indice = await preguntar("\nIngrese el número del evento a modificar: ");
    const eventoIndex = parseInt(indice) - 1;

    if (eventoIndex < 0 || eventoIndex >= eventos.length) {
      console.log("❌ Número de evento inválido");
      return;
    }

    const nuevaFecha = await preguntar("Ingrese la nueva fecha (YYYY-MM-DD): ");

    const fechaAnterior = eventos[eventoIndex].fechaFormateada;
    eventos[eventoIndex].cambiarFecha(nuevaFecha);

    console.log(`\n✅ Fecha modificada exitosamente:`);
    console.log(`   Fecha anterior: ${fechaAnterior}`);
    console.log(`   Nueva fecha: ${eventos[eventoIndex].fechaFormateada}`);
    console.log(`   Evento: ${eventos[eventoIndex].nombre}`);
    console.log(`   Días restantes: ${eventos[eventoIndex].diasRestantes}`);
  } catch (error) {
    console.log(`\n❌ Error al modificar fecha: ${error.message}`);
  }
}

async function verEventosPorFecha() {
  console.log("\n=== Ver Eventos por Fecha ===");

  if (eventos.length === 0) {
    console.log("No hay eventos registrados.");
    return;
  }

  try {
    const fechaBuscar = await preguntar("Ingrese la fecha a buscar (YYYY-MM-DD): ");

    // Validar y parsear fecha de búsqueda
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(fechaBuscar)) {
      console.log("❌ Formato de fecha inválido. Use YYYY-MM-DD");
      return;
    }

    const fechaBuscada = parseISO(fechaBuscar);
    if (!isValid(fechaBuscada)) {
      console.log("❌ Fecha inválida");
      return;
    }

    // Filtrar eventos usando isSameDay de date-fns para comparación precisa
    const eventosEnFecha = eventos.filter(evento =>
      isSameDay(evento.fecha, fechaBuscada)
    );

    if (eventosEnFecha.length === 0) {
      console.log(`\n📅 No hay eventos programados para la fecha ${format(fechaBuscada, 'dd/MM/yyyy', { locale: es })}`);
    } else {
      console.log(`\n📅 Eventos para la fecha ${format(fechaBuscada, 'dd/MM/yyyy', { locale: es })}:`);
      console.log("=".repeat(50));
      eventosEnFecha.forEach((evento, index) => {
        console.log(`${index + 1}. ${evento.mostrarInfo()}`);
      });
    }
  } catch (error) {
    console.log(`\n❌ Error al buscar eventos: ${error.message}`);
  }
}

async function eliminarEvento() {
  console.log("\n=== Eliminar Evento ===");

  if (eventos.length === 0) {
    console.log("No hay eventos registrados.");
    return;
  }

  try {
    // Mostrar eventos disponibles
    console.log("\nEventos disponibles:");
    eventos.forEach((evento, index) => {
      console.log(`${index + 1}. ${evento.mostrarInfo()}`);
    });

    const indice = await preguntar("\nIngrese el número del evento a eliminar: ");
    const eventoIndex = parseInt(indice) - 1;

    if (eventoIndex < 0 || eventoIndex >= eventos.length) {
      console.log("❌ Número de evento inválido");
      return;
    }

    const confirmacion = await preguntar(`¿Está seguro de eliminar "${eventos[eventoIndex].nombre}"? (s/n): `);

    if (confirmacion.toLowerCase() === 's' || confirmacion.toLowerCase() === 'si') {
      const eventoEliminado = eventos.splice(eventoIndex, 1)[0];
      console.log(`\n✅ Evento "${eventoEliminado.nombre}" eliminado exitosamente`);
    } else {
      console.log("\n❌ Operación cancelada");
    }
  } catch (error) {
    console.log(`\n❌ Error al eliminar evento: ${error.message}`);
  }
}

// Función adicional para mostrar todos los eventos ordenados por fecha
async function mostrarTodosLosEventos() {
  console.log("\n=== Todos los Eventos ===");

  if (eventos.length === 0) {
    console.log("No hay eventos registrados.");
    return;
  }

  // Ordenar eventos por fecha
  const eventosOrdenados = [...eventos].sort((a, b) => a.fecha - b.fecha);

  eventosOrdenados.forEach((evento, index) => {
    console.log(`${index + 1}. ${evento.mostrarInfo()}`);
  });
}

// Iniciar el programa
console.log("🎉 Bienvenido al Gestor de Eventos");
console.log("📅 Usa date-fns para manejo avanzado de fechas");

menu();