import { ApiProperty } from "@nestjs/swagger"

export class GetGenreResponse{
    @ApiProperty()
    id: number

    @ApiProperty()
    name: string
}