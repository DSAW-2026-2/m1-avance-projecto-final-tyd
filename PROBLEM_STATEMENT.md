# Problem Statement & Prototype Overview — MiHato

## Problem Statement

En las fincas ganaderas pequeñas y medianas de Colombia (entre 50 y 300 cabezas), el control del hato todavía se lleva de forma manual: cuadernos de campo, hojas de Excel que nadie actualiza con regularidad, o simplemente la memoria del propietario o del mayordomo. Este método informal genera tres problemas concretos:

1. **El conteo de animales es impreciso.** Contar 100, 200 o 300 cabezas a ojo o con rayitas en un cuaderno produce errores: animales contados dos veces, animales que no se registran, o registros que no coinciden con lo que hay realmente en el potrero.
2. **Las fechas de vacunación se pierden.** Sin un calendario centralizado, vacunas de control obligatorio ante el ICA —como Fiebre Aftosa o Brucelosis— se aplican tarde o se olvidan por completo, lo que expone al hato a riesgos sanitarios y al propietario a posibles sanciones.
3. **No existe trazabilidad accesible.** Cuando el ICA visita la finca o un comprador exige el historial sanitario de los animales, no hay una forma rápida y confiable de mostrar esa información: hay que buscar entre cuadernos viejos o reconstruir datos de memoria.

Estos problemas no se deben a falta de disciplina de los ganaderos, sino a la ausencia de una herramienta digital simple, pensada para su contexto: sin curva de aprendizaje técnica, sin necesidad de instalar software, y utilizable tanto desde un computador de oficina como desde un celular en el potrero.

## Target Users

- **Usuario principal:** dueños de fincas ganaderas pequeñas y medianas en Colombia, con hatos de 50 a 300 cabezas, que hoy llevan su control en cuaderno, Excel o de memoria.
- **Usuario secundario:** mayordomos o encargados de finca que registran el día a día del hato (nacimientos, vacunaciones, movimientos entre potreros) por delegación del propietario.
- **Interesados externos:** el ICA (Instituto Colombiano Agropecuario) y compradores de ganado, que en algún momento solicitan evidencia de trazabilidad sanitaria del hato.

## Prototype Overview

**MiHato** es una plataforma web que reemplaza el cuaderno y el Excel por un sistema digital de control de hato, compuesto por dos partes:

- Un **sitio de marketing** (landing page + página de contacto) que explica el problema, la solución y permite a un interesado dejar sus datos de contacto.
- Un **prototipo funcional de aplicación** con seis pantallas: Dashboard, Animales, Detalle de animal, Vacunación, Trazabilidad y Configuración.

### Funcionalidades principales

- **Registro de animales**: alta, edición y eliminación de cada cabeza con arete, nombre, sexo, categoría, raza, fecha de nacimiento, peso, potrero, estado y notas.
- **Alertas de vacunación**: cálculo automático de próximas dosis (Fiebre Aftosa semestral, Brucelosis en hembras jóvenes, entre otras) con estados de "vencida", "próxima" o "al día".
- **Trazabilidad**: generación de reportes —de todo el hato o de un animal puntual— exportables en CSV o listos para imprimir, pensados para entregar al ICA o a un comprador.
- **Dashboard**: indicadores clave (cabezas activas, alertas pendientes, crías recientes, peso promedio), composición del hato y actividad reciente.
- **Configuración**: datos de la finca (nombre, ubicación, código ICA) y preferencias (modo oscuro).
- **Landing page**: explicación del problema y la solución, preguntas frecuentes con buscador (incluyendo un buscador tipo "command palette" activable con `Ctrl/Cmd + K`), y formulario de contacto con validación.
