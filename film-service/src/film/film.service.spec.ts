import { Test, TestingModule } from '@nestjs/testing';
import { FilmService } from './film.service';
import { GetFilmByIdDto } from './dto/get-film-by-id-dto';
import { getModelToken } from '@nestjs/sequelize';
import { Film } from './film.model';
import { FilmGenres } from '../genre/film-genre-model';
import { FilmCountries } from '../country/film-country.model';
import { PersonService } from '../person/person.service';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { GetFilmsForPage } from './dto/get-films-for-page-dto';

const moduleMocker = new ModuleMocker(global);

describe("Film service", () => {
    let filmService: FilmService;
    let repoFilmAnswer = {
        film_id: 1,
        name: 'Аватар',
        alternativeName: 'Avatar',
        year: 2023,
        type: 'movie',
        description: 'test',
        shortDescription: 'test',
        slogan: 'test',
        kprating: 8,
        kpvotes: 1,
        movieLength: 200,
        ageRating: 3,
        trailer: 'test',
        poster: 'test',
        genres: [{name : 'драма'}],
        countries: [{name : 'США'}],
        staff: [],
        reviews: [],
    }

    let getFilmByIdDto : GetFilmByIdDto = {
        film_id: 1,
        name: 'Аватар',
        alternativeName: 'Avatar',
        year: 2023,
        type: 'movie',
        description: 'test',
        shortDescription: 'test',
        slogan: 'test',
        kprating: 8,
        kpvotes: 1,
        movieLength: 200,
        ageRating: 3,
        trailer: 'test',
        poster: 'test',
        genres: ['драма'],
        countries: ['США'],
        staff: [],
        reviews: [],
    }

    let getFilmsForPage : GetFilmsForPage = {
        film_id: 1,
        name: 'Аватар',
        alternativeName: 'Avatar',
        year: 2023,
        type: 'movie',                        
        kprating: 8,
        kpvotes: 1,
        movieLength: 200,
        ageRating: 3,        
        poster: 'test',
        genres: ['драма'],
        countries: ['США'],             
    };
  
    const mockSequelizeFilmRepository = {
        findOne: jest.fn(() => repoFilmAnswer),
        findAll: jest.fn(() => [repoFilmAnswer]),
    };  

    const mockSequelizeFilmGenresRepository = {        
    };  

    const mockSequelizeFilmCountriesRepository = {        
    };      
  
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FilmService,
                { provide: getModelToken(Film), useValue: mockSequelizeFilmRepository },     
                { provide: getModelToken(FilmGenres), useValue: mockSequelizeFilmGenresRepository},
                { provide: getModelToken(FilmCountries), useValue: mockSequelizeFilmCountriesRepository}          
            ],
        }).useMocker((token) => {        
            if (token === PersonService) {
                return {};
            }
            if (typeof token === 'function') {
                const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
                const Mock = moduleMocker.generateFromMetadata(mockMetadata);
                return new Mock();
            }
        }).compile();
  
        filmService = module.get<FilmService>(FilmService);
    });
  
    it("should be defined", () => {
        expect(filmService).toBeDefined();
    });
  

    describe("get film by id", () => {
        it("should find film with specified id and transfer it to GetFilmByIdDto class", async () => {
            const film = await filmService.getFilmById(1);
              
            expect(film).toEqual(getFilmByIdDto);
            expect(mockSequelizeFilmRepository.findOne).toHaveBeenCalledTimes(1);
        });
    });
    
    describe("get films for page", () => {
        it("should find films and transfer it to GetFilmForPage class", async () => {
            const films = await filmService.getFilmsForPage(1);
              
            expect(films[0]).toEqual(getFilmsForPage);
            expect(mockSequelizeFilmRepository.findOne).toHaveBeenCalledTimes(1);
        });
      });
  });