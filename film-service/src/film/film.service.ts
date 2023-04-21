import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Country } from 'src/country/country.model';
import { Genre } from 'src/genre/genre.model';
import { Person } from 'src/person/person.model';
import { PersonService } from 'src/person/person.service';
import { AddFilmDto } from './dto/add-film-dto';
import { GetFilmDto } from './dto/get-film-dto';
import { Film } from './film.model';

@Injectable()
export class FilmService {

    constructor(@InjectModel(Film) private filmRepository : typeof Film,
                private personService : PersonService){}

    filmsLimitInSearch = 20;

    async addFilm(addFilmDto : AddFilmDto) : Promise<Film> {        
        return await this.filmRepository.create(addFilmDto);
    }

    async getAllFilms() : Promise<GetFilmDto[]> {        
        const foundMovies = await this.filmRepository.findAll({include : {all : true}, limit: this.filmsLimitInSearch});        
        const result = this.transformDataForResponse(foundMovies);

        return result;
    }

    async getFilmByName(name : string) : Promise<Film> {
        return await this.filmRepository.findOne({where : {name : name}});
    }

    async getFilmById(id : number) : Promise<GetFilmDto> {
        const foundMovie = await this.filmRepository.findOne({where:{film_id : id}, include : {all : true}})
        const result = this.transformDataForSingleMovie(foundMovie);        

        return result;
    }
  
    async getFilmsByParams(searchParams) : Promise<GetFilmDto[]> {        
        const searchOptions = {include : [{model : Person}], where: [], limit : this.filmsLimitInSearch};
        searchOptions.include.push(this.processGenreOptions(searchParams.genre));
        searchOptions.include.push(this.processCountryOptions(searchParams.country));

        if (searchParams.year){
            searchOptions.where.push({year : {[Op.or]: searchParams.year.split(' ')}});
        }

        const foundMovies = await this.filmRepository.findAll(searchOptions);
        const result = this.transformDataForResponse(foundMovies);

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

    transformDataForResponse(movies) : GetFilmDto[] {
        const result : GetFilmDto[] = [];
        for (let i = 0; i < movies.length; i++){
            result.push( this.transformDataForSingleMovie(movies[i]) );
        }

        return result;
    }

    transformDataForSingleMovie(data : Film) : GetFilmDto {
        const getFilmDto : GetFilmDto = {
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