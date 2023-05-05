import { GetFilmForPerson } from "../../film/dto/get-film-for-person-dto"

export class GetPersonByIdDto{   
    person_id: number 
    name: string  
    enName: string   
    photo: string    
    profession: string   
    description: string    
    enProfession: string 
    films : GetFilmForPerson[]
}