import { GetFilmByIdDto } from "./get-film-by-id-dto";
import { GetFilmsForPage } from "./get-films-for-page-dto";

export class GetFilmPage{    
    film: GetFilmByIdDto;
    lookWith: GetFilmsForPage[];
}