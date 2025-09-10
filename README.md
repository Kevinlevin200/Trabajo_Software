## Administrador de Fechas para Eventos

# Descripción del problema

En la vida diaria, muchas personas necesitan organizar sus actividades y llevar un control de eventos importantes como reuniones, cumpleaños, entregas de proyectos o recordatorios.
Sin embargo, manejar fechas puede ser confuso cuando se requiere:

- Calcular el tiempo que falta para un evento.

- Comparar fechas entre sí.

- Formatear fechas en distintos estilos según el contexto.

Este proyecto resuelve esa necesidad mediante una aplicación de consola sencilla en Node.js, que permite gestionar eventos con un menú interactivo y utiliza la librería date-fns para el manejo de fechas.

# Librería utilizada

Librería: date-fns

# Justificación:

Proporciona funciones modernas y optimizadas para el manejo de fechas.

Es modular, lo que permite importar solo las funciones necesarias.

Ofrece soporte para múltiples formatos y cálculos de tiempo.

Es una alternativa ligera y eficiente frente a librerías más pesadas como moment.js.

# Implementación

- La aplicación de consola fue desarrollada en Node.js con un menú interactivo que incluye al menos tres opciones:

- Registrar un evento con nombre y fecha.

- Calcular diferencia de días entre la fecha actual y un evento.

- Formatear una fecha en diferentes estilos (ej. dd/MM/yyyy, MMMM dd, yyyy).

Tambien cuenta con las siguientes opciones:

1. **Agregar evento** = Permite registrar un evento con nombre, tipo, fecha, precio y estado.
2. **Modificar fechas** = Cambiar la fecha de un evento ya existente.
3. **Ver eventos por fecha** = Buscar todos los eventos programados en una fecha determinada.
4. **Eliminar un evento** = Remover un evento registrado con confirmación de seguridad.
5. **Ver todos los eventos** = Mostrar los eventos registrados, ordenados por fecha.
6. **Salir** = Cierra el programa.

La librería **date-fns** se utiliza para:

* Validar fechas ingresadas por el usuario.
* Formatear fechas en distintos estilos (`dd/MM/yyyy`, `yyyy-MM-dd`).
* Calcular diferencias de días entre la fecha actual y un evento.
* Comparar fechas con precisión (ejemplo: eventos en el mismo día).

## Instalación

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/Kevinlevin200/Trabajo_Software.git
   cd Trabajo_Software
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

---

## Uso del programa

Ejecutar el programa en consola:

bash
node main.js

## Video de presentación

(Enlace)

---

## Autores

* Juan Camilo Rojas Arenas
* Kevin Santiago Rivero Rueda
