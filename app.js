// crear nuestro primer servidor
const express = require('express') // require -> commonJS
const crypto = require('node:crypto') // libreria para encriptar y generar id dinámicamente por ejemplo
const cors = require('cors')
const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')

const app = express()
app.use(express.json())
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:1234',
      'https://movies.com',
      'https://midu.dev'
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))
app.disable('x-powered-by') // desactivar el header X-Powered-By: Express

// -------------------------------------------------

// Todos los recursos que sean MOVIES se identificará con /movies
// Recuperar todas las peliculas
app.get('/movies', (req, res) => {
  // Recuperar todas las películas por un género
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter(
      movie => movie.genre.some(
        g => g.toLowerCase() === genre.toLowerCase()
      )
    )
    return res.json(filteredMovies)
  }
  res.json(movies)
})

// Recuperar una película por id
app.get('/movies/:id', (req, res) => { //
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)
  res.status(404).json({ message: 'Movie not found' })
})

// Crear pelicula
app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (result.error) {
    // 422 Unprocessable Entity
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = {
    // crear id dinámicamente
    id: crypto.randomUUID(), // crea uuid v4 (Unviersal Unique Identifier)
    ...result.data
  }

  movies.push(newMovie)
  res.status(201).json(newMovie) // actualizar la caché del cliente y evitar crear una nueva request
})

// Eliminar pelicula
app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  movies.splice(movieIndex, 1)
  return res.json({ message: 'Movie deleted' })
})

// Actualizar pelicula
app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)

  if (!result.success) {
    return res.status(404).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updateMovie
  return res.json(updateMovie)
})

app.options('/movies/:id', (req, res) => {
  res.send(200)
})

// -------------------------------------------------
const PORT = 1234

app.listen(PORT, () => {
  console.log(`Server Listening on Port ----- http://localhost:${PORT}`)
})
