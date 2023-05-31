import { ApiProperty } from "@nestjs/swagger"

export class AddCountriesToFilm{ 
    @ApiProperty()
    country_id : number[];

    film_id : number;
}