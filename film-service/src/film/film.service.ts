import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Country } from '../country/country.model';
import { Genre } from '../genre/genre.model';
import { Person } from '../person/person.model';
import { PersonService } from '../person/person.service';
import { AddFilmDto } from './dto/add-film-dto';
import { GetFilmByIdDto } from './dto/get-film-by-id-dto';
import { GetFilmsForPage } from './dto/get-films-for-page-dto';
import { Film } from './film.model';

@Injectable()
export class FilmService {

    constructor(@InjectModel(Film) private filmRepository : typeof Film,
                private personService : PersonService){}

    filmsLimitInSearch = 20;

    async addFilm(addFilmDto : AddFilmDto) : Promise<Film> {        
        return await this.filmRepository.create(addFilmDto);
    }

    async getFilmsForPage(page : number) : Promise<GetFilmsForPage[]> {        
        const foundMovies = await this.filmRepository.findAll({include : {all : true}, offset: (page - 1) * this.filmsLimitInSearch, limit: this.filmsLimitInSearch});        
        const transformedData = this.transformDataForResponse(foundMovies);
        let result: GetFilmsForPage[] = [];

        for (let i = 0; i < transformedData.length; i++){
            result.push( this.transformDataForPageMovie(transformedData[i]) );
        }

        return result;
    }

    async getFilmByName(name : string) : Promise<Film> {
        return await this.filmRepository.findOne({where : {name : name}});
    }

    async getFilmById(id : number) : Promise<GetFilmByIdDto> {
        const foundMovie = await this.filmRepository.findOne({where:{film_id : id}, include : {all : true}})
        const result = this.transformDataForSingleMovie(foundMovie);        

        return result;
    }
  
    async getFilmsByParams(searchParams) : Promise<GetFilmsForPage[]> {        
        const searchOptions = {include : [{model : Person}], where: [], limit : this.filmsLimitInSearch};
        searchOptions.include.push(this.processGenreOptions(searchParams.genre));
        searchOptions.include.push(this.processCountryOptions(searchParams.country));

        if (searchParams.year){
            searchOptions.where.push({year : {[Op.or]: searchParams.year.split(' ')}});
        }

        const foundMovies = await this.filmRepository.findAll(searchOptions);
        const transformedData = this.transformDataForResponse(foundMovies);
        let result: GetFilmsForPage[] = [];

        for (let i = 0; i < transformedData.length; i++){
            result.push( this.transformDataForPageMovie(transformedData[i]) );
        }

        return result;
    }

    async getStartPage() {
        let movies = {};
        movies['top10'] = await this.getTopTen('kprating');
        movies['latest'] = await this.getTopTen('year');
        movies['popular'] = await this.getTopTen('kpvotes');

        return movies;
    }

    async getTopTen(filter : string) : Promise<GetFilmsForPage[]> {        
        const foundMovies = await this.filmRepository.findAll({
            include : {all : true},
            order: [
                [filter, 'DESC'],                
            ],

            limit : 10
        });        
        
        const transformedData = this.transformDataForResponse(foundMovies);                
        let result: GetFilmsForPage[] = [];

        for (let i = 0; i < transformedData.length; i++){
            result.push( this.transformDataForPageMovie(transformedData[i]) );
        }

        return result;
    }

    processGenreOptions(genreOptions) : any {
        if (genreOptions){
            return {
                model : Genre,
                as: 'genres',
                where: {
                    name: {
                        [Op.or]: genreOptions.split(' ')
                    }
                }
            }
        }
    
        return { model: Genre }
    }

    processCountryOptions(countryOptions) : any {
        if (countryOptions){
            return {
                model : Country,
                as: 'countries',
                where: {
                    name: {
                        [Op.or]: countryOptions.split(' ')
                    }
                }
            }
        }

        return { model: Country }
    }

    transformDataForResponse(movies) : GetFilmByIdDto[] {
        const result : GetFilmByIdDto[] = [];        
        for (let i = 0; i < movies.length; i++){
            result.push( this.transformDataForSingleMovie(movies[i]) );
        }        

        return result;
    }

    transformDataForPageMovie(data : GetFilmByIdDto) : GetFilmsForPage{
        const getFilmByPageDto : GetFilmsForPage = {
            film_id: data.film_id ,
            name: data.name,
            alternativeName: data.alternativeName,
            year: data.year,                                    
            kprating: data.kprating,            
            movieLength: data.movieLength,                        
            poster: data.poster,
            genres: data.genres,
            countries: data.countries,            
        }  

        return getFilmByPageDto;
    }

    transformDataForSingleMovie(data : Film) : GetFilmByIdDto {
        const getFilmDto : GetFilmByIdDto = {
            film_id: data.film_id ,
            name: data.name,
            alternativeName: data.alternativeName,
            year: data.year,
            description: data.description,
            shortDescription: data.shortDescription,
            slogan: data.slogan,
            kprating: data.kprating,
            kpvotes: data.kpvotes,
            movieLength: data.movieLength,
            ageRating: data.ageRating,
            trailer: data.trailer,
            poster: data.poster,
            genres: [],
            countries: [],
            staff: []
        }  

        data.genres.forEach(genre => {
            getFilmDto.genres.push(genre.name);
        });

        data.countries.forEach(country => {
            getFilmDto.countries.push(country.name);
        });

        data.staff.forEach(person => {
            getFilmDto.staff.push(this.personService.transformToGetPersonDto(person));
        });        

        return getFilmDto;
    }
}