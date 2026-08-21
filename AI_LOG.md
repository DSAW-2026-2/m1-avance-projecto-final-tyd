# AI Log — MiHato

## Sobre este registro

Este documento deja constancia del uso de inteligencia artificial (Claude, de Anthropic, a través de Claude Code) como **apoyo de desarrollo** durante la construcción del prototipo MiHato. La IA se usó como asistente de implementación: escribió código y contenido siguiendo instrucciones y decisiones tomadas por el autor del proyecto en cada etapa, no como un generador autónomo que decidiera el producto por su cuenta. Las decisiones de alcance, estilo, funcionalidad y prioridades quedaron siempre del lado del estudiante; la IA propuso opciones, hizo preguntas de aclaración antes de construir, y ejecutó lo acordado.

## Sesión 1 — Alcance y prototipo base de la app

**Pedido:** construir MiHato como sitio + prototipo de app, con un stack técnico específico ya definido (Vite con salida a `docs/`, Tailwind CSS v4, JavaScript vanilla sin librerías, ESLint con reglas concretas).

**Apoyo de la IA:** antes de escribir código, la IA hizo preguntas puntuales de alcance en vez de asumir — cuántas páginas construir, si los datos debían ser interactivos o solo maquetas fijas, qué dirección de estilo visual usar, y si incluir pantallas de login. Con las respuestas del estudiante (solo prototipo de app, datos interactivos con `localStorage`, estilo "rústico-cálido", sin login), la IA generó el scaffolding del proyecto y las seis pantallas iniciales de la app (Dashboard, Animales, Detalle de animal, Vacunación, Trazabilidad, Configuración), incluyendo el sistema de diseño, la capa de datos y el layout responsivo.


## Sesión 2 — Landing page de marketing

**Pedido:** agregar una página de marketing que explicara el problema real (conteo manual, fechas de vacunación perdidas, falta de trazabilidad ante el ICA) y cómo MiHato lo resuelve, con un diseño atractivo.

**Apoyo de la IA:** propuso la estructura de secciones (problema → solución → cómo funciona → público objetivo → llamado a la acción) y la construyó reutilizando el mismo sistema de diseño de la app. Esto implicó reorganizar el proyecto: la página principal pasó a ser la landing y el dashboard se movió a su propia ruta, actualizando todos los enlaces internos.


## Sesión 3 — FAQ con buscador, página de contacto y corrección de bugs

**Pedido** agregar una sección de preguntas frecuentes con un buscador activable por un atajo de teclado específico, y una página de contacto aparte con formulario (nombre, correo, finca, cabezas de ganado) accesible mediante un botón; además, corregir el parpadeo reportado en la sesión anterior.

**Apoyo de la IA:** diagnosticó la causa del parpadeo (el CSS se cargaba de forma indirecta desde JavaScript en vez de como una hoja de estilos nativa) y lo corrigió en las ocho páginas del sitio. Construyó la sección de FAQ con acordeón, buscador en vivo y un "command palette" activable con `Ctrl/Cmd + K` (con navegación por teclado y una alternativa visible con clic, para no depender solo del atajo). Creó la página de contacto con su formulario y guardado local de las respuestas.

**Verificación:** la IA probó cada interacción nueva en el navegador (atajo de teclado, filtrado del buscador, envío del formulario) antes de dar el avance por terminado.


## Resumen del rol de la IA

En ningún momento la IA definió por sí sola qué construir: cada funcionalidad, corrección o sección nueva partió de un pedido explícito del estudiante, y las decisiones de producto (alcance de páginas, si los datos debían persistir, estilo visual, qué validar, qué preguntas incluir en el FAQ) fueron tomadas por él. El aporte de la IA fue de **implementación, redacción de contenido y verificación técnica** (lint, build y pruebas funcionales en navegador) bajo esa dirección.



