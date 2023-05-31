import { Review } from "src/review/review.model"
import { GetPersonDto } from "../../person/dto/get-person-dto"

export interface GetFilmByIdDto{   
    film_id: number 
    name: string
    alternativeName: string
    year: number
    type: string
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
    reviews: Review[]
}