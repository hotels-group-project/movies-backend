import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { IServiceFilmByIdResponse } from './interfaces/film/film_get_by_id.response.interface';

@Controller('movies')
export class FilmController {
  constructor(@Inject('FILM_SERVICE') private readonly client: ClientProxy) {}

  @Get('/:genre')
  getFilmById(@Param('genre') genre: string): Observable<IServiceFilmByIdResponse> {
    return this.client.send('get_films_by_genre', genre);
  }

  @Get()
  getAllFilms(): Observable<IServiceFilmByIdResponse[]> {
    return this.client.send('get_films', '');
  }
}
