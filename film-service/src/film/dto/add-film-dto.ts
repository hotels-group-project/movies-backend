import { Genre } from "../../genre/genre.model";

export class AddFilmDto{            
    name : string;        
    year : number;    
    description : string    
    movieLength: number;    
    ageRating: number;    
    countries: string;        
}