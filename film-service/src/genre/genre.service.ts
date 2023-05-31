import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Genre } from './genre.model';

@Injectable()
export class GenreService {

    constructor(@InjectModel(Genre) private genreRepository : typeof Genre){}

    async addGenre(name : string){
        return await this.genreRepository.create({name : name});
    }

    async getGenreByName(name : string){
        return await this.genreRepository.findOne({where : {name : name}});
    }

    async getAllGenres(){
        return await this.genreRepository.findAll();
    }    

    async updateGenre(updateGenreDto) {
        const updatedGenre = await this.genreRepository.findOne({where : {genre_id : updateGenreDto.id}});
        updatedGenre.name = updateGenreDto.name;
        return await updatedGenre.save();
    }
}