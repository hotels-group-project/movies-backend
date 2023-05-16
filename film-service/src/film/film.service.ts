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
import { GetFilmPage } from './dto/get-film-page-dto';

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

    async getFilmPage(id : number) : Promise<GetFilmPage> {
        const film = await this.getFilmById(id);
        const result : GetFilmPage = {
            film : film,
            lookWith: await this.getFilmByFilter({
                include : {all : true},
                where: {
                    type: film.type,
                    film_id: {
                        [Op.ne]: film.film_id
                    }
                },
            limit : 10
            })
        }

        return result;
    }
  
    async getFilmsByParams(searchParams) : Promise<GetFilmsForPage[]> {   
        const page = searchParams.page || 1;
        const searchOptions = {   
            attributes: ['film_id'],
            group: 'Film.film_id',
            through: {
                attributes: [],
              },
            include : [
            ], 
            where: [],
            offset: (page - 1) * this.filmsLimitInSearch,            
            limit: this.filmsLimitInSearch,
            subQuery : false,                        
        };
        searchOptions.include.push(this.processGenreOptions(searchParams.genre));
        searchOptions.include.push(this.processCountryOptions(searchParams.country));

        if (searchParams.year){
            searchOptions.where.push({year : {[Op.or]: searchParams.year.split('+')}});
        }

        const foundMoviesId = await this.filmRepository.findAll(searchOptions);
        const filmsId = [];
        foundMoviesId.forEach(film => {
            filmsId.push(film.dataValues.film_id);
        })

        if (filmsId.length == 0){
            return [];
        }

        const foundMovies = await this.filmRepository.findAll({
            include: {all : true},
            where: {
                film_id: {
                    [Op.or]: filmsId
                }
            }
        });

        const transformedData = this.transformDataForResponse(foundMovies);        
        let result: GetFilmsForPage[] = [];

        for (let i = 0; i < transformedData.length; i++){
            result.push( this.transformDataForPageMovie(transformedData[i]) );
        }

        return result;
    }

    async getMainPage() {
        let movies = {};
        const moviesLimit = 15;
        movies['russian'] = await this.getFilmByFilter({
            include : [{model : Person}, {model : Genre}, {
                model : Country, as: "countries", where: {
                    name: {
                        [Op.eq]: ('Россия')
                    }
                }}],            
            limit : moviesLimit
        });
        
        movies['cartoons'] = await this.getFilmByFilter({
            include : {all : true},
            where: {
                type: 'cartoon'
            },
            limit : moviesLimit
        });

        movies['foreign'] = await this.getFilmByFilter({
            include : [{model : Person}, {model : Genre}, {
                model : Country, as: "countries", where: {
                    name: {
                        [Op.ne]: ('Россия')
                    }
                }}],            
            limit : moviesLimit
        })

        return movies;
    }

    async getStartPage() {
        let movies = {};
        const moviesLimit = 15;
        movies['top10'] = await this.getFilmsSortedBy('kprating', 10);            
        
        movies['cartoons'] = await this.getFilmByFilter({
            include : {all : true},
            where: {
                type: 'cartoon'
            },
            limit : moviesLimit
        });

        movies['foreign'] = await this.getFilmByFilter({
            include : [{model : Person}, {model : Genre}, {
                model : Country, as: "countries", where: {
                    name: {
                        [Op.ne]: ('Россия')
                    }
                }}],            
            limit : moviesLimit
        })

        return movies;
    }

    async getFilmByFilter(filter) : Promise<GetFilmsForPage[]> {
        const foundMovies = await this.filmRepository.findAll(filter);

        return this.getResponse(foundMovies);
    }      

    async getFilmsSortedBy(filter : string, limit : number) : Promise<GetFilmsForPage[]> {        
        const foundMovies = await this.filmRepository.findAll({
            include : {all : true},
            order: [
                [filter, 'DESC'],                
            ],

            limit : limit
        });        
        
        return this.getResponse(foundMovies);
    }    

    getResponse(foundMovies) : GetFilmsForPage[]{
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
                attributes: [],             
                through: {
                    attributes: [],
                  },
                as: 'genres',
                where: {
                    name: {
                        [Op.or]: genreOptions.split('+')
                    }
                }
            }
        }
    
        return { model: Genre, attributes: [], through: {attributes: []}}
    }

    processCountryOptions(countryOptions) : any {
        if (countryOptions){
            return {
                model : Country,  
                attributes: [], 
                through: {
                    attributes: []
                },
                as: 'countries',
                where: {
                    name: {
                        [Op.or]: countryOptions.split('+')
                    }
                }
            }
        }

        return { model: Country, attributes: [], through: {attributes: []}}
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
            type: data.type,
            ageRating: data.ageRating || 0,                
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
            type: data.type,
            description: data.description,
            shortDescription: data.shortDescription,
            slogan: data.slogan,
            kprating: data.kprating,
            kpvotes: data.kpvotes,
            movieLength: data.movieLength,
            ageRating: data.ageRating || 0,
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