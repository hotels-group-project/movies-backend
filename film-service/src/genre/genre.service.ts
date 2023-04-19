import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Film } from '../film/film.model';
import { Genre } from './genre.model';

@Injectable()
export class GenreService {

    constructor(@InjectModel(Genre) private genreRepository : typeof Genre){}
    
    // async getFilmsByGenre(genre : string) : Promise<any>{
    //     let result = await this.genreRepository.findOne({where : {name : genre}, include : {all : true}})     
    //     return result.films;
    // }

    async addGenre(name : string){
        return await this.genreRepository.create({name : name});
    }

    async getGenreByName(name : string){
        return await this.genreRepository.findOne({where : {name : name}});
    }
}