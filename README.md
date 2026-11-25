# The Daily Picks 📰

Un diario personal imprimible en A4, con estilo de periódico: tu agenda del día, un artículo para leer, el clima, una sopa de letras y una pregunta para el journal.

Lo diseñé para leer una cosa en papel a la mañana antes de agarrar el celular. Acá está el template para que armes el tuyo.

> **Captura:** agregá acá una imagen de la portada (`img/preview.png`).

## Qué trae

| Página | Qué tiene |
|---|---|
| 1 · Portada | Clima de tu ciudad, tu agenda con horas libres para escribir, el artículo del día resumido, una frase, la palabra del día y la pregunta de la noche |
| 2 · Adentro | El artículo completo en tres columnas |
| Contratapa | Sopa de letras generada con palabras del artículo (con la solución dada vuelta) y espacio para el journal |

## Cómo usarlo (5 minutos)

1. Tocá **Use this template → Create a new repository** arriba a la derecha, o bajá el ZIP desde **Code → Download ZIP**.
2. Copiá `config.js` y llamá a la copia `config.local.js`. Poné tu nombre, tu ciudad (latitud y longitud) y el idioma.
3. Copiá `edition.js` y llamá a la copia `edition.local.js`. Ahí va tu agenda, el artículo y las palabras del día.
4. Abrí `index.html` en **Chrome**.
5. Imprimí con **Cmd/Ctrl + P** (tamaño A4, márgenes "Ninguno", con gráficos de fondo) o guardalo como PDF.

Si no cambiás nada, vas a ver el diario con datos de ejemplo.

## Tus datos no se suben

Todo lo personal vive en dos archivos que **nunca** se suben a GitHub (están en `.gitignore`):

- `config.local.js`: tu nombre y tu ciudad
- `edition.local.js`: tu agenda y tus artículos

Los archivos `config.js` y `edition.js` son solo ejemplos. Si existen las copias `.local.js`, el diario usa esas.

Antes de cada `git commit`, corré `git status` y fijate que no aparezca ningún archivo `.local.js`.

## Armarlo con IA

En [`prompts/armar-la-edicion.md`](prompts/armar-la-edicion.md) hay un prompt para que Claude (u otra IA) te arme la edición del día. Trae tu agenda, elige un artículo de tu lista y arma la sopa de letras y la pregunta. Si lo programás como tarea diaria, el diario aparece listo cada mañana.

## Personalizar

- **Textos fijos e idioma:** en `config.local.js`, sección `labels`. Por ejemplo, `promptLabel: "La pregunta de hoy"`.
- **Clima:** sale de [Open-Meteo](https://open-meteo.com), que es gratis y no pide cuenta. Si preferís cargarlo a mano, usá `weather` en `edition.local.js`.
- **Diseño:** los estilos están en `index.html`, dentro de `<style>`. Los colores están en `:root`.
- **Ilustración y sticker:** la ilustración es un SVG que está en `render.js`, y el texto del sticker se cambia en `config.local.js` → `sticker`.

## Archivos

```
index.html        → el diario (abrí este)
config.js         → configuración de ejemplo
edition.js        → edición de ejemplo
render.js         → arma las páginas (no hace falta tocarlo)
paged.js          → pagina el diario en hojas A4 (Paged.js, MIT)
prompts/          → prompts para armarlo con IA
```

## Créditos

Template creado por [Sofia's Picks](https://www.instagram.com/sofia.vienny/). Usalo, adaptalo y compartilo. Lo único que te pido es que cambies la firma del pie por la tuya.

Licencia MIT. Paged.js © Coko Foundation (MIT).
