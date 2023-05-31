import { ApiProperty } from "@nestjs/swagger"

export class AddFilmDto{ 

    @ApiProperty()
    name: string;

    @ApiProperty()
    alternativeName: string

    @ApiProperty()
    year: number

    @ApiProperty()
    description: string

    @ApiProperty()
    shortDescription: string

    @ApiProperty()
    slogan: string

    @ApiProperty()
    kprating: number

    @ApiProperty()
    kpvotes: number

    @ApiProperty()
    movieLength: number

    @ApiProperty()
    ageRating: number

    @ApiProperty()
    trailer: string

    @ApiProperty()
    poster: string

    @ApiProperty()
    type: string
}