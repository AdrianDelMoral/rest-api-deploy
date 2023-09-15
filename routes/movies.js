import  { Router } from 'express'

import { validateMovie, validatePartialMovie } from '../schemas/movies.js'
import { MovieModel } from '../model/movie.js'

export const moviesRouter = Router()

// Recuperar todas las peliculas de un genero
moviesRouter.get('/', async (req, res) => {
    const { genre } = req.query
    const movies = await MovieModel.getAll({ genre })
    res.json(movies)
})

// Recuperar una película por id
moviesRouter.get('/:id', async (req, res) => { //
    const { id } = req.params
    const movie = await MovieModel.getByID({ id })
    if (movie) return res.json(movie)
    res.status(404).json({ message: 'Movie not found' })
})

// Crear pelicula
moviesRouter.post('/', async (req, res) => {
    const result = validateMovie(req.body)
    
    if (result.error) {
        // 422 Unprocessable Entity
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    
    const newMovie = await MovieModel.create({ input: result.data })

    res.status(201).json(newMovie) // actualizar la caché del cliente y evitar crear una nueva request
})

// Eliminar pelicula
moviesRouter.delete('/movies/:id', async (req, res) => {
    const { id } = req.params

    const result = await MovieModel.delete({ id })

    if (result === false) {
        return res.status(404).json({ message: 'Movie not found' })
    }

    return res.json({ message: 'Movie deleted' })
})

// Actualizar pelicula
moviesRouter.patch('/movies/:id', async (req, res) => {
    const result = validatePartialMovie(req.body)
    
    if (!result.success) {
        return res.status(404).json({ error: JSON.parse(result.error.message) })
    }
    
    const { id } = req.params
    
    const updatedMovie = await MovieModel.update({ id, input: result.data })

    return res.json(updatedMovie)
})