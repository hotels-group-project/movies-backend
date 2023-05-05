import { ApiProperty } from "@nestjs/swagger";

export class GetFilmForPerson{    
    @ApiProperty()
    film_id: number;    

    @ApiProperty()
    name: string;    

    @ApiProperty()
    alternativeName: string;

    @ApiProperty()
    year: number;

    @ApiProperty()
    type: string;

    @ApiProperty()
    kprating: number;    

    @ApiProperty()
    poster: string;    
}