import { ApiProperty } from "@nestjs/swagger"
import { GetFilmsResponse } from "./get-films-response"

export class GetStartPage {
    @ApiProperty({ type: () => [GetFilmsResponse] })
    top10: GetFilmsResponse[]

    @ApiProperty({ type: () => [GetFilmsResponse] })
    latest : GetFilmsResponse[]

    @ApiProperty({ type: () => [GetFilmsResponse] })
    popular: GetFilmsResponse[]
}