import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Film } from '../film/film.model';
import { CountryController } from './country.controller';
import { Country } from './country.model';
import { CountryService } from './country.service';
import { FilmCountries } from './film-country.model';

@Module({
  controllers: [CountryController],
  providers: [CountryService],
  imports : [    
    SequelizeModule.forFeature([Film, Country, FilmCountries]),     
  ],
  exports : [CountryService]
})
export class CountryModule {}
