import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GetFilmForPerson } from 'src/film/dto/get-film-for-person-dto';
import { AddPersonDto } from './dto/add-person-dto';
import { GetPersonByIdDto } from './dto/get-person-by-id-dto';
import { GetPersonDto } from './dto/get-person-dto';
import { Person } from './person.model';

@Injectable()
export class PersonService {    

    constructor(@InjectModel(Person) private personRepository : typeof Person){}
    
    async getAllActors(){
        return await this.personRepository.findAll({include : {all : true}});
    }

    async getPersonById(id: number){
        const data = await this.personRepository.findOne({include : {all : true}, where: {person_id: id}});
        const person = this.transformToGetPersonById(data);        

        return person;
    }

    async addPerson(addPersonDto: AddPersonDto){        
        return await this.personRepository.create(addPersonDto);
    }

    async getPersonByName(name: string){
        return await this.personRepository.findOne({where : {name : name}});
    }

    transformToGetPersonById(person) {
        const result : GetPersonByIdDto = {
            person_id : person.person_id,
            name : person.name,       
            enName: person.enName,     
            photo: person.photo,            
            profession: person.profession,
            description: person.description,
            enProfession: person.enProfession,
            films: []
        }
        
        for (let i = 0; i < person.films.length; i++){
            result.films.push(this.getFilmForPerson(person.films[i]));
        }

        return result;
    }

    getFilmForPerson(filmDto): GetFilmForPerson{
        return {
            film_id: filmDto.film_id,
            name: filmDto.name,
            alternativeName: filmDto.alternativeName,
            year: filmDto.year,
            kprating: filmDto.kprating,  
            poster: filmDto.poster
        }
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
