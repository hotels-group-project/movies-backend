import { ApiProperty } from "@nestjs/swagger"

export class AddGenreDto {
    @ApiProperty()
    name: string
}