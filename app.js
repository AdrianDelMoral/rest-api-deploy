// crear nuestro primer servidor
import express, { json } from 'express' // require -> commonJS
import { moviesRouter } from './routes/movies'
import { corsMiddleware } from './middlewares/cors'

// import movies from './movies.json' // <- ESTO NO ES VÁLIDO EN NODE
// EN EL FUTURO: el import del json será así:
// import movies from './movies.json' with { type: 'json'} // <- 

// como leer un json en ESModules
/* import fs from 'node:fs'
 const movies = JSON.parse(fs.readFile('./movies.json', 'utf-8')) */

// como leer un json en ESModules recomendado por ahora

const app = express()
app.use(json())
app.use(corsMiddleware())
app.disable('x-powered-by') // desactivar el header X-Powered-By: Express

// -------------------------------------------------

// Todos los recursos que sean MOVIES se identificará con /movies
// Cuando acceda a /movies podré acceder a todas las rutas que tengo en moviesRouter(hemos separado todas las rutas que tengan que ver con /movies, que va a ser como el prefijo)
app.use('/movies', moviesRouter)

app.options('/:id', (req, res) => {
  res.send(200)
})

// -------------------------------------------------
const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`Server Listening on Port ----- http://localhost:${PORT}`)
})
