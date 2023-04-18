import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Country } from 'src/country/country.model';
import { Genre } from 'src/genre/genre.model';
import { Film } from './film.model';

@Injectable()
export class FilmService {

  constructor(@InjectModel(Film) private filmRepository : typeof Film){}

  async getAllFilms() : Promise<Film[]> {
    return await this.filmRepository.findAll({include : {all : true}});
  }

  async getFilmsByParams(searchParams) : Promise<Film[]> {
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

    return await this.filmRepository.findAll(searchOptions);
  }
}
