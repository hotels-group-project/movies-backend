import { Test, TestingModule } from '@nestjs/testing';
import { PersonService } from './person.service';
import { getModelToken } from '@nestjs/sequelize';
import { Person } from './person.model';

describe("Person service", () => {
  let personService: PersonService;
  let person = {
    person_id: 1,
    name: 'test',  
    enName: 'test',   
    photo: 'test',    
    profession: 'test',
    description: 'test',
    enProfession: 'test', 
    films : []
  }

  const mockSequelizePersonRepository = {
    findAll: jest.fn(() => [person]),
    findOne: jest.fn(() => person),
  };  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonService,
        { provide: getModelToken(Person), useValue: mockSequelizePersonRepository },                
      ],
    }).compile();

    personService = module.get<PersonService>(PersonService);
  });

  it("should be defined", () => {
    expect(personService).toBeDefined();
  });

  describe("get all actors", () => {
    it("should find all actors", async () => {
      const actors = await personService.getPersonsByProfession('');

      expect(actors).toHaveLength(1);
      expect(mockSequelizePersonRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("get person by id", () => {
    it("should find actor with specified id", async () => {
      const actor = await personService.getPersonById(1);

      expect(actor).toEqual(person);
      expect(mockSequelizePersonRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
});