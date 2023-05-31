import { Module } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { FilmModule } from '../film/film.module';
import { GenreModule } from '../genre/genre.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilmGenres } from '../genre/film-genre-model';
import { CountryModule } from '../country/country.module';
import { FilmCountries } from '../country/film-country.model';
import { PersonModule } from '../person/person.module';
import { FilmPersons } from '../person/film-actor.model';

@Module({
    providers: [TransferService],
    controllers: [TransferController],
    imports: [FilmModule, GenreModule, CountryModule, PersonModule,
        SequelizeModule.forFeature([FilmGenres, FilmCountries, FilmPersons]),
    ]
})
export class TransferModule {}
