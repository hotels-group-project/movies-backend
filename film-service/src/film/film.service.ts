import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Country } from 'src/country/country.model';
import { Genre } from 'src/genre/genre.model';
import { AddFilmDto } from './dto/add-film-dto';
import { GetFilmDto } from './dto/get-film-dto';
import { Film } from './film.model';

@Injectable()
export class FilmService {

    constructor(@InjectModel(Film) private filmRepository : typeof Film){}

    async addFilm(addFilmDto : AddFilmDto) : Promise<Film> {        
        return await this.filmRepository.create(addFilmDto);
    }

    async getAllFilms() : Promise<GetFilmDto[]> {
        const foundMovies = await this.filmRepository.findAll({include : {all : true}});
        let result = this.transformDataForResponse(foundMovies);

        return result;
    }

    async getFilmByName(name : string) : Promise<Film> {
        return await this.filmRepository.findOne({where : {name : name}});
    }
  
    async getFilmsByParams(searchParams) : Promise<GetFilmDto[]> {
        let searchOptions = {include : [], where: []};   
        searchOptions.include.push(this.processGenreOptions(searchParams.genre));
        searchOptions.include.push(this.processCountryOptions(searchParams.country));

        if (searchParams.year){
            searchOptions.where.push({year : {[Op.or]: searchParams.year.split(' ')}});
        }

        const foundMovies = await this.filmRepository.findAll(searchOptions);
        let result = this.transformDataForResponse(foundMovies);

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
        let result : GetFilmDto[] = [];
        for (let i = 0; i < movies.length; i++){
            result.push( this.transformDataForSingleMovie(movies[i]) );
        }

        return result;
    }

    transformDataForSingleMovie(data : Film) : GetFilmDto {
        let getFilmDto : GetFilmDto = {
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
            genres: [],
            countries: []
        }  

        data.genres.forEach(genre => {
            getFilmDto.genres.push(genre.name);
        });

        data.countries.forEach(country => {
            getFilmDto.countries.push(country.name);
        });

        return getFilmDto;
    }
}