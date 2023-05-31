import { ApiProperty } from "@nestjs/swagger"
import { GetPersonDto } from "../person/get-person-dto"
import { GetReviewDto } from "../review/get-review.dto";

export class FilmByIdResponse{
    @ApiProperty()
    film_id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    alternativeName: string;

    @ApiProperty()
    year: number;

    @ApiProperty()
    description: string;

    @ApiProperty()
    shortDescription: string;

    @ApiProperty()
    slogan: string;

    @ApiProperty()
    kprating: number;

    @ApiProperty()
    kpvotes: number;

    @ApiProperty()
    type: string;

    @ApiProperty()
    movieLength: number;

    @ApiProperty()
    ageRating: number;

    @ApiProperty()
    trailer: string;

    @ApiProperty()
    poster: string;

    @ApiProperty()
    genres: string[];

    @ApiProperty()
    countries: string[];

    @ApiProperty({ type: () => [GetPersonDto] })
    staff: GetPersonDto[];

    @ApiProperty({type: () => [GetReviewDto] })
    reviews: GetReviewDto[];
}