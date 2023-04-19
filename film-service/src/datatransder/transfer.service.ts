import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { AddFilmDto } from '../film/dto/add-film-dto';
import { FilmService } from '../film/film.service';
import { GenreService } from 'src/genre/genre.service';
import { InjectModel } from '@nestjs/sequelize';
import { FilmGenres } from 'src/genre/film-genre-model';
import { Film } from 'src/film/film.model';
import { CountryService } from 'src/country/country.service';
import { FilmCountries } from 'src/country/film-country.model';

@Injectable()
export class TransferService {

  constructor (private filmService : FilmService,
               private genreService : GenreService,
               private countryService : CountryService,
               @InjectModel(FilmGenres) private filmGenresRepository : typeof FilmGenres,
               @InjectModel(FilmCountries) private filmCountriesRepository : typeof FilmCountries){}

    async moveFilmsIntoDb(){     
      let dataStorage = 'D:\\FinalProject\\movies-backend\\data';
      const files = fs.readdirSync(dataStorage);
      let data = [];

      files.forEach(file => {
        data.push(fs.readFileSync(`${dataStorage}\\${file}`, 'utf-8'));
      });  

      
      for (let i = 0; i < data.length; i++){
        console.log(i);
        try {
          let parsedData = await JSON.parse(data[i]); 
          if (parsedData.name){
            await this.transfer(parsedData);
          }
        } catch {
        }
      };            
    }

  async transfer(parsedData) {    
    if (await this.filmService.getFilmByName(parsedData.name)){
      return;
    }    

    let rating = parsedData.rating;    
    let ratingkp = null;    
    if (rating && rating.kp){
      ratingkp = rating.kp;      
    }

    let votes = parsedData.votes;
    let voteskp = null;
    if (votes && votes.kp){
      voteskp = votes.kp;
    }

    let addFilmDto : AddFilmDto = {
      name : parsedData.name,
      alternativeName : parsedData.alternativeName,
      year : parsedData.year,
      ageRating : parsedData.ageRating,        
      description: parsedData.description,
      shortDescription: parsedData.shortDescription,
      slogan: parsedData.slogan,
      kprating: ratingkp,
      kpvotes: voteskp,
      movieLength: parsedData.movieLength,        
    }            
    
    let film : Film = await this.filmService.addFilm(addFilmDto);

    let genres = parsedData.genres;
    
    genres.forEach(async (element) => {
      let genre = await this.genreService.getGenreByName(element.name);
      if (!genre) {
          genre = await this.genreService.addGenre(element.name);
      }  

      await this.filmGenresRepository.create({film_id : film.film_id, genre_id : genre.genre_id});
    });
                  
    let countries = parsedData.countries;
    
    countries.forEach(async (element) => {
        let country = await this.countryService.getCountryByName(element.name);
        if (!country) {
            country = await this.countryService.addCountry(element.name);
        } 

        await this.filmCountriesRepository.create({film_id : film.film_id, country_id : country.country_id});
    });   
  }
}