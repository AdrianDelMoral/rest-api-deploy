import { Router } from 'express'

import { MovieController } from '../controllers/movies.js'

export const moviesRouter = Router()

moviesRouter.get('/', MovieController.getAll) // Recuperar todas las peliculas de un genero
moviesRouter.post('/', MovieController.create) // Crear pelicula

moviesRouter.get('/:id', MovieController.getById)  // Recuperar una película por id
moviesRouter.delete('/:id', MovieController.delete) // Eliminar pelicula
moviesRouter.patch('/:id', MovieController.update) // Actualizar pelicula