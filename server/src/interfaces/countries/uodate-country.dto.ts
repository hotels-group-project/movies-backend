import { ApiProperty } from "@nestjs/swagger"

export class UpdateCountryDto {
    @ApiProperty()
    id: number

    @ApiProperty()
    name: string
}