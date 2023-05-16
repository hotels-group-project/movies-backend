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
}
