import { Module } from '@nestjs/common';
import { FilmService } from './film.service';
import { FilmController } from './film.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Film } from './film.model';
import { Genre } from '../genre/genre.model';
import { FilmGenres } from '../genre/film-genre-model';
import { Country } from '../country/country.model';
import { FilmCountries } from '../country/film-country.model';
import { Person } from '../person/person.model';
import { FilmPersons } from '../person/film-actor.model';
import { PersonModule } from '../person/person.module';
import { Review } from '../review/review.model';

@Module({
  providers: [FilmService],
  controllers: [FilmController],
  imports : [    
    SequelizeModule.forFeature([Film, Genre, FilmGenres, Country, FilmCountries, Person, FilmPersons, Review]),     
    PersonModule
  ],
  exports : [
    FilmService    
  ]
})
export class FilmModule {}
