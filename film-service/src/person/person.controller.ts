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
}
