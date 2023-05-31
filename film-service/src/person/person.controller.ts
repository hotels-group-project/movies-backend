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
    getAllPersonsByProfession(profession : string) : any {
        return this.personService.getPersonsByProfession(profession);
    }  

    @MessagePattern('get_person_by_params')
    getPersonByParams(params) : any {
        return this.personService.getPersonByParams(params);
    }

    @MessagePattern('get_persons_for_slider')
    getPersonsForSlider() {
        return this.personService.getPersonsForSlider();
    }
}
