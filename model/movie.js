import { readJSON } from "../utils"

const movies = readJSON('../movies.json')

export class MovieModel {
    static getAll ({ genre }) {
        if(genre){
            return moviesRouter.filter(
                movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
            )
        }
        
        return movies
    }
}