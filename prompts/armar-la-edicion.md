# Prompt para que la IA arme tu edición del día

Copiá esto en Claude (o en la IA que uses) con la carpeta del diario abierta.
Cambiá lo que está entre [corchetes].

---

```
Estoy usando el template "The Daily Picks" (está en esta carpeta).
Armame la edición de hoy en el archivo edition.local.js.
Si no existe, creala copiando edition.js. No toques edition.js ni ningún otro archivo.

1. Agenda: traé mis eventos de hoy de [Google Calendar / mi calendario] y ponelos en "schedule"
   (hora, título corto y duración). Si no tenés acceso, dejá "schedule" vacío.
   Borrá "scheduleNote".
2. Artículo: elegí uno de [esta lista de links / mi página de Notion "..." / este link: ...]
   que todavía no haya leído. Completá "article":
   - headline: título corto para la portada (máx. 6 palabras)
   - title, author, publication, published, readMinutes: los datos reales del artículo
   - dek: una bajada de una línea
   - summary: 2 párrafos cortos que lo resuman, con tus palabras
   - body: el artículo en HTML (<p>, <h4>, <blockquote>, <ol>).
     Si es un artículo de otra persona, guardalo solo en mi copia local, para leerlo yo.
3. quote: la frase más fuerte del artículo, con su autor.
4. highlights: dos bloques cortos ("La idea" y "Probalo").
5. wordOfTheDay: una palabra del artículo con su definición.
6. words: 12 palabras del artículo para la sopa de letras (máx. 13 letras cada una).
7. prompt y promptShort: una pregunta de journal en castellano, conectada con el artículo
   (la corta tiene que entrar en 3 renglones).
8. date: la fecha de hoy en formato AAAA-MM-DD.

Cuando termines, abrí index.html para chequear que entra todo en las páginas.
```

---

## Para que se arme sola todos los días

En Claude podés crear una **tarea programada** con este mismo prompt para que corra
cada mañana antes de que te levantes. Después solo abrís `index.html` e imprimís.

## Privacidad

- Tu agenda y tus artículos quedan **solo** en `edition.local.js`, que está en `.gitignore`.
- Antes de hacer un commit, corré `git status` y fijate que no aparezca ningún archivo `.local.js`.
