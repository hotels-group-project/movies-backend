import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Country } from './country/country.model';
import { FilmCountries } from './country/film-country.model';
import { Film } from './film/film.model';
import { FilmModule } from './film/film.module';
import { FilmGenres } from './genre/film-genre-model';
import { Genre } from './genre/genre.model';
import { GenreModule } from './genre/genre.module';
import { TransferModule } from './datatransfer/transfer.module';
import { CountryModule } from './country/country.module';
import { PersonModule } from './person/person.module';
import { Person } from './person/person.model';
import { FilmPersons } from './person/film-actor.model';
import { ReviewModule } from './review/review.module';
import { Review } from './review/review.model';

@Module({
  imports: [  
    ConfigModule.forRoot({
    envFilePath: '.env'
  }),
  SequelizeModule.forRoot({
    dialect: 'postgres',
    host: 'postgres',
    port: 5432,
    username: 'postgres',
    password: '123123',
    database: 'postgres',
    models: [Film, Genre, FilmGenres, Country, FilmCountries, Person, FilmPersons, Review],
    autoLoadModels: true
  }),
    HttpModule,
    FilmModule,
    GenreModule,
    TransferModule,
    CountryModule,
    PersonModule,
    ReviewModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
