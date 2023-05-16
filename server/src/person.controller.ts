import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetPersonResponse } from './interfaces/person/get-person-by-id-response';
import { GetPersonBySearchParamsDto } from './interfaces/person/get-person-by-search-params.dto';
import { Observable } from 'rxjs';

@Controller()
export class PersonController {
  constructor(@Inject('FILM_SERVICE') private readonly client: ClientProxy) {}  

  @Get('person/:id')
  @ApiTags('Person')
  @ApiResponse({ 
    status: 200, 
    description: 'get person information',    
    type: GetPersonResponse
  })
  getPerson(@Param('id') id : number) {
    return this.client.send('get_person', id);
  }

  @Get('actors')
  @ApiTags('Person')
  @ApiResponse({ 
    status: 200, 
    description: `get all actors names and id's`,
    type: [GetPersonBySearchParamsDto]
  })
  getAllActors(){
    return this.client.send('get_by_profession', 'actor');
  }

  @Get('producers')
  @ApiTags('Person')
  @ApiResponse({ 
    status: 200, 
    description: `get all producers names and id's`,
    type: [GetPersonBySearchParamsDto]
  })
  getAllProducers(){
    return this.client.send('get_by_profession', 'producer');
  }

  @Get('profession/search?')
  @ApiTags('Person')
  @ApiResponse({ 
    status: 200, 
    description: 'get person name and id by search params',        
    type: [GetPersonBySearchParamsDto]
  })  
  @ApiQuery({ name: 'profession', required: false, description: 'producer, actor or leave empty for any profession' })
  @ApiQuery({ name: 'name', required: false })  
  getPersonByName(    
    @Query('profession') profession: string,
    @Query('name') name: string,    
  ): Observable<GetPersonBySearchParamsDto[]> {    
    let searchParams = {profession : profession, name : name}
    return this.client.send('get_actor_by_params', searchParams);
  }
}