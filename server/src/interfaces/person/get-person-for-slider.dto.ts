import { ApiProperty } from "@nestjs/swagger"

export class GetPersonForSliderDto{   
    @ApiProperty()
    person_id: number 

    @ApiProperty()
    firstName: string

    @ApiProperty()
    lastName: string      

    @ApiProperty()
    photo: string 
    
    @ApiProperty()   
    films_count: number    
}