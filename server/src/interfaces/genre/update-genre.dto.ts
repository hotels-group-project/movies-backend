import { ApiProperty } from "@nestjs/swagger"

export class UpdateGenreDto {
    @ApiProperty()
    id: number

    @ApiProperty()
    name: string
}