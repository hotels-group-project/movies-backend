import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiProperty, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { FilmByIdResponse } from './interfaces/film/film-get-by-id.response';
import { GetFilmsResponse } from './interfaces/film/get-films-response';

@Controller('movies')
export class FilmController {
  constructor(@Inject('FILM_SERVICE') private readonly client: ClientProxy) {}

  @Get('/search?')
  @ApiTags('film')
  @ApiResponse({ 
    status: 200, 
    description: 'get films by search params',    
    type: [GetFilmsResponse] 
  })
  @ApiQuery({ name: 'genre', required: false })
  @ApiQuery({ name: 'year', required: false })
  @ApiQuery({ name: 'country', required: false })
  getFilmBySearchParams(    
    @Query('genre') genre: string,
    @Query('year') year: number,
    @Query('country') country : string
  ): Observable<GetFilmsResponse> {    
    let searchParams = {genre : genre, year : year, country : country }
    return this.client.send('get_films_by_params', searchParams);
  }

  @Get('/page/:page')
  @ApiTags('film')
  @ApiResponse({ 
    status: 200, 
    description: 'get 20 films for page',    
    type: [GetFilmsResponse]
  })
  getAllFilms(@Param('page') page: number): Observable<GetFilmsResponse[]> {
    return this.client.send('get_films', page);
  }

  @Get('/:id')
  @ApiTags('film')
  @ApiResponse({ 
    status: 200, 
    description: 'get film by id',    
    type: FilmByIdResponse 
  })
  getFilmById(@Param('id') id: number): Observable<FilmByIdResponse> {    
    return this.client.send('get_film_by_id', id);
  }
}
