import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetFilmByIdDto } from './dto/get-film-by-id-dto';
import { GetFilmsForPage } from './dto/get-films-for-page-dto';
import { FilmService } from './film.service';
import { GetFilmPage } from './dto/get-film-page-dto';

@Controller()
export class FilmController {
    constructor(private readonly filmService: FilmService) {}

    @MessagePattern('get_films')
    getFilmsForPage(page: number) : Promise<GetFilmsForPage[]> {
        return this.filmService.getFilmsForPage(page);
    }  

    @MessagePattern('get_films_by_params')
    getFilmsByParams(searchParams) : Promise<GetFilmsForPage[]>{        
        return this.filmService.getFilmsByParams(searchParams);
    }

    @MessagePattern('get_film_by_id')
    getFilmById(id: number) : Promise<GetFilmByIdDto> {    
        return this.filmService.getFilmById(id);
    }

    @MessagePattern('get_film_page')
    getFilmPage(id: number) : Promise<GetFilmPage> {
        return this.filmService.getFilmPage(id);
    }

    @MessagePattern('get_top_ten')
    getTopTen() : Promise<GetFilmsForPage[]> {    
        return this.filmService.getFilmsSortedBy('kprating', 10);
    }

    @MessagePattern('get_new_films')
    getNewFilms() : Promise<GetFilmsForPage[]> {    
        return this.filmService.getFilmsSortedBy('year', 10);
    }

    @MessagePattern('get_start_page')
    getStartPage() {
        return this.filmService.getStartPage();
    }

    @MessagePattern('get_main_page')
    getMainPage() {
        return this.filmService.getMainPage();
    }

    @MessagePattern('add_film')
    addFilm(addFilmDto) {
        return this.filmService.addFilm(addFilmDto);
    }

    @MessagePattern('add_genres_to_film')
    addGenresToFilm(addGenresToFilmDto) {
        return this.filmService.addGenresToFilm(addGenresToFilmDto);
    }

    @MessagePattern('add_countries_to_film')
    addCountriesToFilm(addCountriesToFilmDto) {
        return this.filmService.addCountriesToFilm(addCountriesToFilmDto);
    }


    @MessagePattern('update_film')
    updateFilm(updateFilmDto) {
        return this.filmService.updateFilm(updateFilmDto);
    }

    @MessagePattern('delete_film')
    deleteFilm(id) {
        return this.filmService.deleteFilm(id);
    }    
}
