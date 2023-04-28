import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Film } from '../film/film.model';
import { FilmGenres } from './film-genre-model';
import { GenreController } from './genre.controller';
import { Genre } from './genre.model';
import { GenreService } from './genre.service';

@Module({
  controllers: [GenreController],
  providers: [GenreService],
  imports : [    
    SequelizeModule.forFeature([Film, Genre, FilmGenres]),     
  ],
  exports : [GenreService]
})
export class GenreModule {}
