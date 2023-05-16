import { ApiProperty } from "@nestjs/swagger"
import { GetFilmsResponse } from "./get-films-response"

export class GetMainPage {
    @ApiProperty({ type: () => [GetFilmsResponse] })
    russian: GetFilmsResponse[]    

    @ApiProperty({ type: () => [GetFilmsResponse] })
    cartoons: GetFilmsResponse[]

    @ApiProperty({ type: () => [GetFilmsResponse] })
    foreign: GetFilmsResponse[]
}