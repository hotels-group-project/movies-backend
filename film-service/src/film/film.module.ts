import { Module } from '@nestjs/common';
import { FilmService } from './film.service';
import { FilmController } from './film.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Film } from './film.model';
import { Genre } from 'src/genre/genre.model';
import { FilmGenres } from 'src/genre/film-genre-model';

@Module({
  providers: [FilmService],
  controllers: [FilmController],
  imports : [    
    SequelizeModule.forFeature([Film, Genre, FilmGenres]),     
  ]
})
export class FilmModule {}
