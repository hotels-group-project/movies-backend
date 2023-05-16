import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiProperty, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { FilmByIdResponse } from './interfaces/film/film-get-by-id.response';
import { GetFilmsResponse } from './interfaces/film/get-films-response';
import { GetStartPage } from './interfaces/film/get-start-page-films';
import { GetFilmPage } from './interfaces/film/get-film-page.response';
import { GetGenreResponse } from './interfaces/film/get-genre.response';
import { GetMainPage } from './interfaces/film/get-main-page.response';

@Controller('movies')
export class FilmController {
  constructor(@Inject('FILM_SERVICE') private readonly client: ClientProxy) {}

  @Get('/search?')
  @ApiTags('Film')
  @ApiResponse({ 
    status: 200, 
    description: 'get films by search params',    
    type: [GetFilmsResponse] 
  })
  @ApiQuery({ name: 'genre', required: false })
  @ApiQuery({ name: 'year', required: false })
  @ApiQuery({ name: 'country', required: false })
  @ApiQuery({ name: 'page', required: false })  
  getFilmBySearchParams(    
    @Query('genre') genre: string,
    @Query('year') year: string,
    @Query('country') country : string,
    @Query('page') page : number,    
  ): Observable<GetFilmsResponse> {    
    let searchParams = {genre : genre, year : year, country : country, page : page }
    return this.client.send('get_films_by_params', searchParams);
  }

  @Get('/page/:page')
  @ApiTags('Film')
  @ApiResponse({ 
    status: 200, 
    description: 'get 20 films for page',    
    type: [GetFilmsResponse]
  })
  getAllFilms(@Param('page') page: number): Observable<GetFilmsResponse[]> {
    return this.client.send('get_films', page);
  }

  @Get('/top')
  @ApiTags('Film')
  @ApiResponse({
    status: 200, 
    description: 'get top 10 films',    
    type: [GetFilmsResponse]
  })
  getTopTen(): Observable<GetFilmsResponse[]> {
    return this.client.send('get_top_ten', '');
  }

  @Get('/genres')
  @ApiTags('Genre')
  @ApiResponse({
    status: 200, 
    description: 'Return all genres in db',    
    type: [GetGenreResponse]
  })
  getAllGenres(): Observable<GetGenreResponse[]> {
    return this.client.send('get_genres', '');
  }

  @Get('/countries')
  @ApiTags('Country')
  @ApiResponse({
    status: 200, 
    description: 'Return all countries in db',    
    type: [GetGenreResponse]
  })
  getAllCountries(): Observable<GetGenreResponse[]> {
    return this.client.send('get_countries', '');
  }

  @Get('/newFilms')
  @ApiTags('Film')
  @ApiResponse({
    status: 200, 
    description: 'get 10 latests films',    
    type: [GetFilmsResponse]
  })
  getNewFilms(): Observable<GetFilmsResponse[]> {
    return this.client.send('get_new_films', '');
  }

  @Get('/startPage')
  @ApiTags('Film')
  @ApiResponse({
    status: 200, 
    description: 'get startPage',    
    type: GetStartPage    
  })
  getStartPage() {
    return this.client.send('get_start_page', '');
  }

  @Get('/mainPage')
  @ApiTags('Film')
  @ApiResponse({
    status: 200, 
    description: 'get mainPage',    
    type: GetMainPage
  })
  getMainPage() {
    return this.client.send('get_main_page', '');
  }

  @Get('/:id')
  @ApiTags('Film')
  @ApiResponse({ 
    status: 200, 
    description: 'get film page by film id',    
    type: GetFilmPage
  })
  getFilmById(@Param('id') id: number): Observable<GetFilmPage> {    
    return this.client.send('get_film_page', id);
  }

}
