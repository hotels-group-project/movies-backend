import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetPersonResponse } from './interfaces/person/get-person-by-id-response';

@Controller('person')
export class PersonController {
  constructor(@Inject('FILM_SERVICE') private readonly client: ClientProxy) {}  

  @Get('/:id')
  @ApiTags('person')
  @ApiResponse({ 
    status: 200, 
    description: 'get person information',    
    type: GetPersonResponse
  })
  getPersons(@Param('id') id : number) {
    return this.client.send('get_person', id);
  }
}