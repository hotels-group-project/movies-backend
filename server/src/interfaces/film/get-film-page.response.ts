import { ApiProperty } from "@nestjs/swagger";
import { FilmByIdResponse } from "./film-get-by-id.response";
import { GetFilmsResponse } from "./get-films-response";

export class GetFilmPage{    
    @ApiProperty({ type: () => FilmByIdResponse })    
    film: FilmByIdResponse;

    @ApiProperty({ type: () => [GetFilmsResponse]})
    lookWith: GetFilmsResponse[];
}