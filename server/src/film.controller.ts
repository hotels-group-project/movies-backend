import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { IServiceFilmByIdResponse } from './interfaces/film/film-get-by-id.response.interface';

@Controller('movies')
export class FilmController {
  constructor(@Inject('FILM_SERVICE') private readonly client: ClientProxy) {}

  @Get('/search?')
  getFilmBySearchParams(
    @Query('genre') genre: string,
    @Query('year') year: number,
    @Query('country') country : string
  ): Observable<IServiceFilmByIdResponse> {    
    let searchParams = {genre : genre, year : year, country : country }
    return this.client.send('get_films_by_params', searchParams);
  }

  @Get()
  getAllFilms(): Observable<IServiceFilmByIdResponse[]> {
    return this.client.send('get_films', '');
  }

  @Get('/:id')
  getFilmById(@Param('id') id: number): Observable<IServiceFilmByIdResponse> {    
    return this.client.send('get_film_by_id', id);
  }
}
