import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { AddFilmDto } from '../film/dto/add-film-dto';
import { FilmService } from '../film/film.service';
import { GenreService } from 'src/genre/genre.service';
import { InjectModel } from '@nestjs/sequelize';
import { FilmGenres } from 'src/genre/film-genre-model';
import { Film } from 'src/film/film.model';
import { CountryService } from 'src/country/country.service';
import { FilmCountries } from 'src/country/film-country.model';
import { PersonService } from 'src/person/person.service';
import { FilmPersons } from 'src/person/film-actor.model';

@Injectable()
export class TransferService {

    constructor (private filmService : FilmService,
                private genreService : GenreService,
                private countryService : CountryService,
                private personService : PersonService,
                @InjectModel(FilmGenres) private filmGenresRepository : typeof FilmGenres,
                @InjectModel(FilmCountries) private filmCountriesRepository : typeof FilmCountries,
                @InjectModel(FilmPersons) private filmPersonsRepository : typeof FilmPersons,){}

    async moveFilmsIntoDb(){       
        const dataStorage = path.resolve(__dirname, '..', '..', '..', 'data');       
        const files = fs.readdirSync(dataStorage);
        let data = [];

        files.forEach(file => {
            data.push(fs.readFileSync(`${dataStorage}\\${file}`, 'utf-8'));
        });  

        const filmsToProceed = data.length;           
        for (let i = 0; i < filmsToProceed; i++){            
            try {
                let parsedData = await JSON.parse(data[i]); 
                if (parsedData.name){
                    await this.addDataToDB(parsedData);
                }
            } catch {}
        }  

        return {message : 'success', filmsProcessed : data.length}
    } 

    async addDataToDB(parsedData){  
        if (await this.filmService.getFilmByName(parsedData.name)){
            return;
        }    

        const addFilmDto : AddFilmDto = this.mapParsedDataToAddFilmDto(parsedData);    
        const film : Film = await this.filmService.addFilm(addFilmDto);
        await this.addGenres(parsedData, film.film_id);
        await this.addCountries(parsedData, film.film_id);
        await this.addPersons(parsedData, film.film_id);
    }

    async addPersons(parsedData, film_id){
        const staff = parsedData.persons;        
  
        for (let i = 0; i < staff.length; i++){
            let person = await this.personService.getPersonByName(staff[i].name);
            if (!person) {
                person = await this.personService.addPerson(staff[i]);
            }  

            await this.filmPersonsRepository.create({film_id : film_id, person_id : person.person_id});
        }
    }

    async addGenres(parsedData, film_id){
        const genres = parsedData.genres;
  
        genres.forEach(async (element) => {
            let genre = await this.genreService.getGenreByName(element.name);
            if (!genre) {
                genre = await this.genreService.addGenre(element.name);
            }  

            await this.filmGenresRepository.create({film_id : film_id, genre_id : genre.genre_id});
        });
    }

    async addCountries(parsedData, film_id){
        const countries = parsedData.countries;
  
        countries.forEach(async (element) => {
            let country = await this.countryService.getCountryByName(element.name);
            if (!country) {
                country = await this.countryService.addCountry(element.name);
            } 

            await this.filmCountriesRepository.create({film_id : film_id, country_id : country.country_id});
        });   
    }

    private mapParsedDataToAddFilmDto(parsedData) : AddFilmDto{
        const ratingkp = this.getRatingKp(parsedData.rating);
        const voteskp = this.getVotesKp(parsedData.votes);
        const trailer = this.getTrailer(parsedData.videos);    
        const poster = this.getPoster(parsedData.poster); 

        const addFilmDto : AddFilmDto = {
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
            trailer: trailer,
            poster: poster
        }

        return addFilmDto;
    }

    private getPoster(poster){
        return poster ? poster.url : null;
    }

    private getRatingKp(rating){
        return rating ? rating.kp : null;
    }

    private getVotesKp(votes){
       return votes ? votes.kp : null;
    }

    private getTrailer(videos){
        if (videos && videos.trailers && videos.trailers.length > 0){
            return videos.trailers[0].url;
        }

        return null;
    }
}