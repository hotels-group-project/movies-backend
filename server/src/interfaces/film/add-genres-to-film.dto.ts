import { ApiProperty } from "@nestjs/swagger"

export class AddGenresToFilm{ 
    @ApiProperty()
    genre_id : number[];

    film_id : number;
}