import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PersonService } from './person.service';

@Controller()
export class PersonController {
    constructor(private readonly personService: PersonService) {}

    @MessagePattern('get_person')
    getPersonById(id: number) : any {
        return this.personService.getPersonById(id);
    }  

    @MessagePattern('get_by_profession')
    getAllActors(profession : string) : any {
        return this.personService.getAllActors(profession);
    }  

    @MessagePattern('get_actor_by_params')
    getPersonByParams(params) : any {
        return this.personService.getPersonByParams(params);
    }
}
