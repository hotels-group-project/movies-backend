import { ApiProperty } from "@nestjs/swagger"

export class AddReviewDto {
    @ApiProperty()
    film_id : number;

    @ApiProperty()
    previous_review_id : number;

    @ApiProperty()
    text : string;

    user_id : number;

    user_name : string;
}