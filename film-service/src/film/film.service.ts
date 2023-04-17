import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Genre } from 'src/genre/genre.model';
import { Film } from './film.model';

@Injectable()
export class FilmService {

  constructor(@InjectModel(Film) private filmRepository : typeof Film){}

  async getAllFilms() : Promise<Film[]> {
    return await this.filmRepository.findAll({include : [{model : Genre}]});
  }
}
