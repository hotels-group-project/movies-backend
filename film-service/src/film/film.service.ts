import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, where } from 'sequelize';
import { Country } from '../country/country.model';
import { Genre } from '../genre/genre.model';
import { Person } from '../person/person.model';
import { PersonService } from '../person/person.service';
import { GetFilmByIdDto } from './dto/get-film-by-id-dto';
import { GetFilmsForPage } from './dto/get-films-for-page-dto';
import { Film } from './film.model';
import { GetFilmPage } from './dto/get-film-page-dto';
import { AddFilmDto } from './dto/add-film-dto';
import { FilmGenres } from '../genre/film-genre-model';
import { FilmCountries } from '../country/film-country.model';

@Injectable()
export class FilmService {

    constructor(@InjectModel(Film) private filmRepository : typeof Film,
                @InjectModel(FilmGenres) private filmGenresRepository : typeof FilmGenres,
                @InjectModel(FilmCountries) private filmCountriesRepository : typeof FilmCountries,
                private personService : PersonService){}

    filmsLimitInSearch = 20;
    querySeparator = '+';

    async addFilm(addFilmDto : AddFilmDto) : Promise<Film> {      
        return await this.filmRepository.create(addFilmDto);
    }

    async addGenresToFilm(addGenresToFilmDto) {
        const genres = addGenresToFilmDto.genre_id;
        const film_id = addGenresToFilmDto.film_id;
        genres.forEach(async element => {
            await this.filmGenresRepository.create({film_id : film_id, genre_id : element});
        });

        return {message : 'genres succesfully added'};
    }

    async addCountriesToFilm(addCountriesToFilmDto) {
        const countries = addCountriesToFilmDto.country_id;
        const film_id = addCountriesToFilmDto.film_id;
        countries.forEach(async element => {
            await this.filmCountriesRepository.create({film_id : film_id, country_id : element});
        });

        return {message : 'countries succesfully added'};
    }

    async updateFilm(updateFilmdDto) {
        let filmToUpdate = await this.filmRepository.findOne({where : {film_id : updateFilmdDto.id}});
        for (let key in updateFilmdDto){
            filmToUpdate[key] = updateFilmdDto[key];
        }
        
        return await filmToUpdate.save();
    }

    async deleteFilm(id) {
        await this.filmRepository.destroy({where : {film_id : id}});
        return {message : 'success'};
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
            include : [], 
            where: [],
            offset: (page - 1) * this.filmsLimitInSearch,            
            limit: this.filmsLimitInSearch,
            subQuery : false,                        
        };
                
        searchOptions.include.push(this.processGenreOptions(searchParams.genre));
        searchOptions.include.push(this.processCountryOptions(searchParams.country)); 
        searchOptions.include.push(this.processPersonOptions(searchParams.actor, searchParams.director));

        if (searchParams.year){
            searchOptions.where.push({year : {[Op.or]: searchParams.year.split(this.querySeparator)}});
        }
        
        if (searchParams.rating){
            searchOptions.where.push({kprating : {[Op.gte]: searchParams.rating}});
        }

        if (searchParams.marksCount){
            searchOptions.where.push({kpvotes : {[Op.gte]: searchParams.marksCount}});
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

    getPossibleOptions(searchParams) : any {
        const searchOptions = {   
            attributes: [],            
            through: {
                attributes: ['countries.name', 'films.year', 'genres.name'],
                group: ['countries.name', 'films.year', 'genres.name']
            },
            where: [],
            subQuery : false,                        
        };

        if (searchParams.genre){
            searchOptions.where.push({
                name: {
                    [Op.or]: searchParams.genre.split('+')
                }
            });
        }

        if (searchParams.country){
            searchOptions.where.push({
                name: {
                    [Op.or]: searchParams.country.split('+')
                }
            });
        }
    }

    async getMainPage() {
        let movies = {};
        const moviesLimit = 20;
        movies['russian'] = await this.getFilmByFilter({
            include : [ {model : Person}, {model : Genre}, 
                {
                    model : Country, as: "countries", 
                    where: {
                        name: {
                            [Op.eq]: ('Россия')
                        }                        
                    }
                }],
            where: {type : 'movie'},
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
            include : [ {model : Person}, {model : Genre}, 
                {
                    model : Country, as: "countries", where: 
                    {
                        name: {
                            [Op.ne]: ('Россия')
                        },                     
                    }
                }],       
            where: {type : 'movie'},
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

    processGenreOptions(genreOptions : string) : any {
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
                        [Op.or]: genreOptions.split(this.querySeparator)
                    }
                }
            }
        }
    
        return { model: Genre, attributes: [], through: {attributes: []}}
    }    

    processCountryOptions(countryOptions : string) : any {
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
                        [Op.or]: countryOptions.split(this.querySeparator)
                    }
                }
            }
        }

        return { model: Country, attributes: [], through: {attributes: []}}
    }

    processPersonOptions(actorName : string, directorName : string) : any {        
        let whereOption = {};
        if (actorName && directorName){
            whereOption = {
                [Op.and] : [
                    {
                        name : actorName,
                        enProfession : 'actor'
                    },
                    {
                        name : directorName,
                        enProfession : 'director'
                    }
                ]
            }
        } else if (actorName) {
            whereOption = {
                name : actorName,
                enProfession : 'actor'
            }
        } else if (directorName) {
            whereOption = {
                name : directorName,
                enProfession : 'director'
            }
        }

        return {
            model : Person,   
            attributes: [],             
            through: {
                attributes: [],
            },
            as: 'staff',
            where: whereOption
        }                
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
            kpvotes: data.kpvotes,            
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
            staff: [],
            reviews : data.reviews,
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