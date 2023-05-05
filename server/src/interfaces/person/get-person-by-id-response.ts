import { ApiProperty } from "@nestjs/swagger";
import { GetFilmForPerson } from "../film/get-film-for-person"

export class GetPersonResponse{   
    @ApiProperty()
    person_id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    enName: string;
    
    @ApiProperty()
    photo: string;
    
    @ApiProperty()
    profession: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    enProfession: string;

    @ApiProperty({ type: () => [GetFilmForPerson] })
    films : GetFilmForPerson[]
}