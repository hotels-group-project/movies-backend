import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { GetFilmsResponse } from './interfaces/film/get-films-response';
import { GetStartPage } from './interfaces/film/get-start-page-films';
import { GetFilmPage } from './interfaces/film/get-film-page.response';
import { GetGenreResponse } from './interfaces/genre/get-genre.dto';
import { GetMainPage } from './interfaces/film/get-main-page.response';
import { AddFilmDto } from './interfaces/film/add-film.dto';
import { Roles } from './guards/role-auth.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/role.guard';
import { AddGenresToFilm } from './interfaces/film/add-genres-to-film.dto';
import { AddCountriesToFilm } from './interfaces/film/add-countries-to-film.dto';

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
    @ApiQuery({ name: 'rating', required: false })  
    @ApiQuery({ name: 'marksCount', required: false })
    @ApiQuery({ name: 'actor', required: false })
    @ApiQuery({ name: 'director', required: false })
    @ApiQuery({ name: 'page', required: false })  
    getFilmBySearchParams(    
        @Query('genre') genre: string,
        @Query('year') year: string,
        @Query('country') country : string,
        @Query('rating') rating : string,
        @Query('marksCount') marksCount : string,
        @Query('actor') actor : string,
        @Query('director') director : string,
        @Query('page') page : number,    
    ): Observable<GetFilmsResponse> {    
        let searchParams = {genre : genre, year : year, country : country, page : page, rating : rating, marksCount : marksCount, actor : actor, director : director }         
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

    @ApiExcludeEndpoint()
    @Get('/country')
    getAllCountries(): Observable<GetGenreResponse[]> {
        return this.client.send('get_countries', '');
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

    @ApiExcludeEndpoint()
    @Get('/genres')    
    getAllGenres(): Observable<GetGenreResponse[]> {
      return this.client.send('get_genres', '');
    }

    @Get('/id/:id')
    @ApiTags('Film')
    @ApiResponse({ 
        status: 200, 
        description: 'get film page by film id',    
        type: GetFilmPage
    })
    getFilmById(@Param('id') id: number): Observable<GetFilmPage> {    
        return this.client.send('get_film_page', id);
    }

    @ApiBearerAuth()
    @Roles('Admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @ApiTags('Film')
    @ApiResponse({ 
        status: 201, 
        description: 'film added to db',
    })
    addFilm(@Body() addFilmDto : AddFilmDto) {          
        return this.client.send('add_film', addFilmDto);
    }

    @ApiBearerAuth()
    @Roles('Admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put('/:id/genres')
    @ApiTags('Film')
    @ApiResponse({ 
        status: 200, 
        description: 'add genres to film',
    })
    addGenresToFilm(@Param('id') id : number,
                    @Body() genresDto : AddGenresToFilm) {          
        genresDto.film_id = id;
        return this.client.send('add_genres_to_film', genresDto);
    }

    @ApiBearerAuth()
    @Roles('Admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put('/:id/countries')
    @ApiTags('Film')
    @ApiResponse({ 
        status: 200, 
        description: 'add countries to film',
    })
    addCountriesToFilm(@Param('id') id : number,
                       @Body() countriesDto : AddCountriesToFilm) {          
        countriesDto.film_id = id;
        return this.client.send('add_countries_to_film', countriesDto);
    }

    @ApiBearerAuth()
    @Roles('Admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put('/:id')
    @ApiTags('Film')
    @ApiResponse({ 
        status: 200, 
        description: 'updated film data',            
    })
    updateFilm(@Param('id') id: number,
               @Body() addFilmDto : AddFilmDto): Observable<GetFilmPage> {
        let data = {...addFilmDto, id : id}
        return this.client.send('update_film', data);
    }

    @ApiBearerAuth()
    @Roles('Admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete('/:id')
    @ApiTags('Film')
    @ApiResponse({ 
        status: 200, 
        description: 'delete film data',            
    })
    deleteFilm(@Param('id') id: number) {        
        return this.client.send('delete_film', id);
    }
}
