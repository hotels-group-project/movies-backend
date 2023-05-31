import { ApiProperty } from "@nestjs/swagger"

export class GetPersonBySearchParamsDto{   
    @ApiProperty()
    person_id: number ;

    @ApiProperty()
    name: string;
}