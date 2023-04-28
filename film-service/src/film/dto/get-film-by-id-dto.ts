import { GetPersonDto } from "../../person/dto/get-person-dto"

export interface GetFilmByIdDto{   
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
    poster: string
    genres: string[]
    countries: string[]
    staff: GetPersonDto[]
}