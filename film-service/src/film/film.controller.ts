import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Film } from './film.model';
import { FilmService } from './film.service';

@Controller()
export class FilmController {
  constructor(private readonly filmService: FilmService) {}

  @MessagePattern('get_films')
  getAllFilms() : Promise<Film[]> {
    return this.filmService.getAllFilms();
  }  

  @MessagePattern('get_films_by_params')
  getFilmsByParams(searchParams){
    return this.filmService.getFilmsByParams(searchParams);
  }
}
