import { ApiProperty } from "@nestjs/swagger"

export class GetCountryResponse{
    @ApiProperty()
    id: number

    @ApiProperty()
    name: string
}