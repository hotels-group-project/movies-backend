import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetFilmByIdDto } from './dto/get-film-by-id-dto';
import { GetFilmsForPage } from './dto/get-films-for-page-dto';
import { FilmService } from './film.service';

@Controller()
export class FilmController {
  constructor(private readonly filmService: FilmService) {}

  @MessagePattern('get_films')
  getFilmsForPage(page: number) : Promise<GetFilmsForPage[]> {
    return this.filmService.getFilmsForPage(page);
  }  

  @MessagePattern('get_films_by_params')
  getFilmsByParams(searchParams: string) : Promise<GetFilmsForPage[]>{
    return this.filmService.getFilmsByParams(searchParams);
  }

  @MessagePattern('get_film_by_id')
  getFilmsById(id: number) : Promise<GetFilmByIdDto> {
    return this.filmService.getFilmById(id);
  }
}
