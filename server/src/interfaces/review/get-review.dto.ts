import { ApiProperty } from "@nestjs/swagger"

export class GetReviewDto{
    @ApiProperty()
    review_id: number;

    @ApiProperty()
    film_id : number

    @ApiProperty()
    user_id : number

    @ApiProperty()
    user_name : string;

    @ApiProperty()
    previous_review_id: number;

    @ApiProperty()
    test : string;
    
    @ApiProperty()
    createdAt : Date;                
}