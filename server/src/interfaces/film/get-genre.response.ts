import { ApiProperty } from "@nestjs/swagger"

export class GetGenreResponse{
    @ApiProperty()
    name: string
}