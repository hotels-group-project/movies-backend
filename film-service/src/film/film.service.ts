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

  async getAllFilms() : Promise<Film[]> {
    return await this.filmRepository.findAll({include : {all : true}});
  }

  async getFilmByName(name : string) : Promise<Film> {
    return await this.filmRepository.findOne({where : {name : name}});
  }

  async getFilmsByParams(searchParams) : Promise<GetFilmDto[]> {
    let searchOptions = {include : [], where: []};    
    if (searchParams.genre){
      searchOptions.include.push({
        model : Genre,
        as: 'genres',
        where: {
          name: {
            [Op.or]: searchParams.genre.split(' ')
          }}});
    } else {
      searchOptions.include.push({model: Genre});
    }   

    if (searchParams.country){      
      searchOptions.include.push({
        model : Country,
        as: 'countries',
        where: {
          name: {
            [Op.or]: searchParams.country.split(' ')
          }}});
    } else {
      searchOptions.include.push({model: Country});
    }

    if (searchParams.year){
      searchOptions.where.push({year : {[Op.or]: searchParams.year.split(' ')}});
    }

    const foundMovies = await this.filmRepository.findAll(searchOptions);
    let result = this.formAnswer(foundMovies);

    return result;
  }

  formAnswer(movies) : GetFilmDto[]{
    let result : GetFilmDto[] = [];
    for (let i = 0; i < movies.length; i++){
      result.push( this.transformDataForSingleMovie(movies[i]) );
    }

    return result;
  }

  transformDataForSingleMovie(data : Film) : GetFilmDto{
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
