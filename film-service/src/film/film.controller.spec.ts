import { Test, TestingModule } from '@nestjs/testing';
import { FilmController } from './film.controller';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { FilmService } from './film.service';

const moduleMocker = new ModuleMocker(global);

describe('FilmController', () => {
    let filmController: FilmController;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [FilmController],
        }).useMocker((token) => {
            const results = ['test1', 'test2'];
            if (token === FilmService) {
                return { 
                    getFilmsForPage: jest.fn().mockResolvedValue(results[0]) ,
                    getFilmsByParams: jest.fn().mockResolvedValue(results)
                }
            }
            if (typeof token === 'function') {
                const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
                const Mock = moduleMocker.generateFromMetadata(mockMetadata);
                return new Mock();
            }
        }).compile();
    
        filmController = moduleRef.get(FilmController);
    });  

    it('should be defined', () => {
        expect(filmController).toBeDefined();
    });

    describe("get films for page", () => {
        it("should return films for page", async () => {
            const result = await filmController.getFilmsForPage(1);

            expect(result).toEqual('test1');      
        });
    });
});