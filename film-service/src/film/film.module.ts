import { Module } from '@nestjs/common';
import { FilmService } from './film.service';
import { FilmController } from './film.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Film } from './film.model';
import { Genre } from 'src/genre/genre.model';
import { FilmGenres } from 'src/genre/film-genre-model';
import { Country } from 'src/country/country.model';
import { FilmCountries } from 'src/country/film-country.model';
import { Person } from 'src/person/person.model';
import { FilmPersons } from 'src/person/film-actor.model';
import { PersonModule } from 'src/person/person.module';

@Module({
  providers: [FilmService],
  controllers: [FilmController],
  imports : [    
    SequelizeModule.forFeature([Film, Genre, FilmGenres, Country, FilmCountries, Person, FilmPersons]),     
    PersonModule
  ],
  exports : [
    FilmService    
  ]
})
export class FilmModule {}
