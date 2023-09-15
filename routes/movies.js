import  { randomUUID } from 'node:cypto' // libreria para encriptar y generar id dinámicamente por ejemplo
import  { Router } from 'express'

import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

import { readJSON } from '../utils'

const movies = readJSON('../movies.json')
export const moviesRouter = Router()

// Todas las rutas que sean "/movies", responderan a este router que hemos creado:

// Recuperar todas las peliculas
moviesRouter.get('/', (req, res) => {
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
moviesRouter.get('/:id', (req, res) => { //
    const { id } = req.params
    const movie = movies.find(movie => movie.id === id)
    if (movie) return res.json(movie)
    res.status(404).json({ message: 'Movie not found' })
})

// Crear pelicula
moviesRouter.get('/', (req, res) => {
    const result = validateMovie(req.body)
    
    if (result.error) {
        // 422 Unprocessable Entity
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    
    const newMovie = {
        // crear id dinámicamente
        id: randomUUID(), // crea uuid v4 (Unviersal Unique Identifier)
        ...result.data
    }

    movies.push(newMovie)
    res.status(201).json(newMovie) // actualizar la caché del cliente y evitar crear una nueva request
})

// Eliminar pelicula
moviesRouter.delete('/movies/:id', (req, res) => {
    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) {
        return res.status(404).json({ message: 'Movie not found' })
    }

    movies.splice(movieIndex, 1)
    return res.json({ message: 'Movie deleted' })
})

// Actualizar pelicula
moviesRouter.patch('/movies/:id', (req, res) => {
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