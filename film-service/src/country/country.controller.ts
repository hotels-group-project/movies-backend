import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CountryService } from './country.service';

@Controller()
export class CountryController {
    constructor (private readonly countryService: CountryService) {}

    @MessagePattern('get_countries')
    getAllCountries() : Promise<any[]> {
        return this.countryService.getAllCountries();     
    }   

    @MessagePattern('add_country')
    addCountry(addCountryDto) : Promise<any> {
        return this.countryService.addCountry(addCountryDto.name);
    }  

    @MessagePattern('update_country')
    updateGenre(updateCountryDto) : Promise<any> {
        return this.countryService.updateCountry(updateCountryDto);
    }      
}
