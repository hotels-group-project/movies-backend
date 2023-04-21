import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetFilmDto } from './dto/get-film-dto';
import { FilmService } from './film.service';

@Controller()
export class FilmController {
  constructor(private readonly filmService: FilmService) {}

  @MessagePattern('get_films')
  getAllFilms() : Promise<GetFilmDto[]> {
    return this.filmService.getAllFilms();
  }  

  @MessagePattern('get_films_by_params')
  getFilmsByParams(searchParams: string){
    return this.filmService.getFilmsByParams(searchParams);
  }

  @MessagePattern('get_film_by_id')
  getFilmsById(id: number){
    return this.filmService.getFilmById(id);
  }
}
