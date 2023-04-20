export class GetFilmDto{   
    film_id: number 
    name: string
    alternativeName: string
    year: number
    description: string
    shortDescription: string
    slogan: string
    kprating: number
    kpvotes: number
    movieLength: number
    ageRating: number
    trailer: string
    genres: string[]
    countries: string[]
}