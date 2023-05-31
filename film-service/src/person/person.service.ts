import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GetFilmForPerson } from '../film/dto/get-film-for-person-dto';
import { AddPersonDto } from './dto/add-person-dto';
import { GetPersonByIdDto } from './dto/get-person-by-id-dto';
import { GetPersonDto } from './dto/get-person-dto';
import { Person } from './person.model';
import { Op } from 'sequelize';
import { GetPersonBySearchParams } from './dto/get-person-by-search-params.dto';
import { GetPersonForSliderDto } from './dto/get-persons-for-slider.dto';

@Injectable()
export class PersonService {    

    constructor(@InjectModel(Person) private personRepository : typeof Person){}

    async getPersonsByProfession(profession : string) : Promise<GetPersonBySearchParams[]> {
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
        const personData = await this.personRepository.findOne({include : {all : true}, where: {person_id: id}});
        const personDataForResponse = this.transformToGetPersonById(personData);  

        return personDataForResponse;
    }

    async addPerson(addPersonDto: AddPersonDto){        
        return await this.personRepository.create(addPersonDto);
    }

    async getPersonByParams(params) : Promise<GetPersonBySearchParams[]> {  

        const nameFilter = this.parseNameParams(params.name);        

        const searchParams = {        
            name : {
                [Op.substring]: nameFilter, 
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

    async getPersonsForSlider(limitForSlider = 60) {         
        const personsForSlider = (await this.personRepository.sequelize.query(
            `select persons.person_id, persons.name, persons.photo, COUNT(persons.name) as films_count from persons
            join film_persons using(person_id)
            join films using(film_id)
            where persons.name IS NOT NULL
            group by persons.name, persons.person_id, persons.photo
            having Count(persons.name) > 2
            limit 60`))[0];            

        const result : GetPersonForSliderDto[] = [];
        for (let i = 0; i < personsForSlider.length; i++){
            result.push(this.transferDataForSliderDto(personsForSlider[i]));
        }

        return result;
    }

    parseNameParams(nameString : string) {
        const elements = nameString.split(' ');
        let result = "";
        elements.forEach(element => {
            if (element.length > 0) {
                result += element[0].toUpperCase() + element.substring(1) + ' ';
            }
        });

        return result.substring(0, result.length - 1);
    }

    transferDataForSliderDto(data) : GetPersonForSliderDto {
        const dataName = data.name.split(' ');
        let lastName = '';
        for (let i = 1; i < dataName.length; i++){
            lastName += dataName[i] + ' ';
        }

        return {
            person_id : data.person_id,            
            firstName: dataName[0],
            lastName: lastName.substring(0, lastName.length - 1),
            photo: data.photo,    
            films_count: data.films_count  
        }
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
