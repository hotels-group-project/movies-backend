import { Body, Controller, Get, Inject, Post, Put, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { GetCountryResponse } from './interfaces/countries/get-country.dto';
import { Roles } from './guards/role-auth.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/role.guard';
import { AddCountryDto } from './interfaces/countries/add-country.dto';
import { UpdateCountryDto } from './interfaces/countries/uodate-country.dto';

@Controller('countries')
export class CountryController {
    constructor(@Inject('FILM_SERVICE') private readonly client: ClientProxy) {}  

    @Get()
    @ApiTags('Country')
    @ApiResponse({
        status: 200, 
        description: 'Return all countries in db',    
        type: [GetCountryResponse]
    })
    getAllCountries(): Observable<GetCountryResponse[]> {
        return this.client.send('get_countries', '');
    }

    @ApiBearerAuth()
    @Roles('Admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()  
    @ApiTags('Country')
    @ApiResponse({
        status: 200, 
        description: 'Return created country', 
        type: GetCountryResponse           
    })      
    addCountry(@Body() addCountryDto : AddCountryDto){          
        return this.client.send('add_country', addCountryDto);
    }

    @ApiBearerAuth()
    @Roles('Admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put()  
    @ApiTags('Country')
    @ApiResponse({
        status: 200, 
        description: 'Return updated country',            
        type: GetCountryResponse
    })      
    updateGenre(@Body() updateCountryDto : UpdateCountryDto){          
        return this.client.send('update_country', updateCountryDto);
    }    
}