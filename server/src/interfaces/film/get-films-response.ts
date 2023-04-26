import { ApiProperty } from "@nestjs/swagger"

export class GetFilmsResponse{
    @ApiProperty()
    film_id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    alternativeName: string;

    @ApiProperty()
    year: number;

    @ApiProperty()
    kprating: number;

    @ApiProperty()
    movieLength: number;

    @ApiProperty()
    poster: string;

    @ApiProperty()
    genres: string[];

    @ApiProperty()
    countries: string[];

}