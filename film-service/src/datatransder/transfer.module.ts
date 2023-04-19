import { Module } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { FilmModule } from 'src/film/film.module';
import { GenreModule } from 'src/genre/genre.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilmGenres } from '../genre/film-genre-model';
import { CountryModule } from 'src/country/country.module';
import { FilmCountries } from 'src/country/film-country.model';

@Module({
  providers: [TransferService],
  controllers: [TransferController],
  imports: [FilmModule, GenreModule, CountryModule,
    SequelizeModule.forFeature([FilmGenres, FilmCountries]),]
})
export class TransferModule {}
