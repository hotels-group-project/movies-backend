import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AddPersonDto } from './dto/add-person-dto';
import { GetPersonDto } from './dto/get-person-dto';
import { Person } from './person.model';

@Injectable()
export class PersonService {    

    constructor(@InjectModel(Person) private personRepository : typeof Person){}
    
    async getAllActors(){
        return await this.personRepository.findAll({include : {all : true}});
    }

    async getPersonById(id: number){
        return await this.personRepository.findOne({include : {all : true}, where: {person_id: id}});
    }

    async addPerson(addPersonDto: AddPersonDto){        
        return await this.personRepository.create(addPersonDto);
    }

    async getPersonByName(name: string){
        return await this.personRepository.findOne({where : {name : name}});
    }

    transformToGetPersonDto(person) {
        const getPersonDto : GetPersonDto = {
            person_id : person.person_id,
            name : person.name,       
            enName: person.enName,     
            photo: person.photo,            
            profession: person.profession,
            description: person.description,
            enProfession: person.enProfession
        }

        return getPersonDto;
    }
}
