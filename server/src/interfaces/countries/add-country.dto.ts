import { ApiProperty } from "@nestjs/swagger"

export class AddCountryDto {
    @ApiProperty()
    name: string
}