import { ApiProperty } from "@nestjs/swagger"

export class GetPersonDto{   
    @ApiProperty()
    person_id: number ;

    @ApiProperty()
    name: string;

    @ApiProperty()   
    photo: string;
    
    @ApiProperty()   
    profession: string    
}