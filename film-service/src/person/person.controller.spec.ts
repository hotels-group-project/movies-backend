import { Test } from '@nestjs/testing';
import { PersonController } from './person.controller';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { PersonService } from './person.service';

const moduleMocker = new ModuleMocker(global);

describe("Person controller", () => {
  let personController: PersonController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PersonController],
    })
    .useMocker((token) => {
      const results = ['test1', 'test2'];
      if (token === PersonService) {
        return { 
          getPersonById: jest.fn().mockResolvedValue(results[0]) ,
          getPersonsByProfession: jest.fn().mockResolvedValue(results)
        };
      }
      if (typeof token === 'function') {
        const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
        const Mock = moduleMocker.generateFromMetadata(mockMetadata);
        return new Mock();
      }
    })
    .compile();
    
    personController = moduleRef.get(PersonController);
  });

  it("should be defined", () => {
    expect(personController).toBeDefined();
  });

  describe("get person by id", () => {
    it("should find person with specified id", async () => {
      const result = await personController.getPersonById(1);

      expect(result).toEqual('test1');      
    });
  });

  describe("get all persons by profession", () => {
    it("should find all persons by profession", async () => {
      const result = await personController.getAllPersonsByProfession('');

      expect(result).toEqual(['test1','test2']);      
    });
  });
})