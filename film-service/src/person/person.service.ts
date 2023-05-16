import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GetFilmForPerson } from '../film/dto/get-film-for-person-dto';
import { AddPersonDto } from './dto/add-person-dto';
import { GetPersonByIdDto } from './dto/get-person-by-id-dto';
import { GetPersonDto } from './dto/get-person-dto';
import { Person } from './person.model';
import { Op } from 'sequelize';
import { GetPersonBySearchParams } from './dto/get-person-by-search-params.dto';

@Injectable()
export class PersonService {    

    constructor(@InjectModel(Person) private personRepository : typeof Person){}

    async getAllActors(profession : string) : Promise<GetPersonBySearchParams[]> {
        return await this.personRepository.findAll({            
            attributes: ['person_id', 'name'],                  
            where : {
                enProfession: profession,
                name: {[Op.not]: null}
            }
        });
    }

    async getPersonByNameAndProfession(name : string, enProfession : string) {
        return await this.personRepository.findOne({
            where: {
                name : name,
                enProfession : enProfession
            }});
    }

    async getPersonById(id: number) : Promise<GetPersonByIdDto> {
        const data = await this.personRepository.findOne({include : {all : true}, where: {person_id: id}});
        const person = this.transformToGetPersonById(data);        

        return person;
    }

    async addPerson(addPersonDto: AddPersonDto){        
        return await this.personRepository.create(addPersonDto);
    }

    async getPersonByParams(params) : Promise<GetPersonBySearchParams[]> {        
        let searchParams = {
            name : {
                [Op.substring]: params.name, 
            },
            enProfession: {
                [Op.not] : null
            }
        }

        if (params.profession){
            searchParams.enProfession = params.profession;
        }
        
        return await this.personRepository.findAll({
            attributes: ['person_id', 'name'],
            where: searchParams,
            limit: 10
        })        
    }

    transformToGetPersonById(person) : GetPersonByIdDto {
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
            type: filmDto.type,
            poster: filmDto.poster
        }
    }

    transformToGetPersonDto(person) : GetPersonDto {
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
