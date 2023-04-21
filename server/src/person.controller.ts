import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('person')
export class PersonController {
  constructor(@Inject('FILM_SERVICE') private readonly client: ClientProxy) {}  

  @Get('/:id')
  getPersons(@Param('id') id : number) {
    return this.client.send('get_person', id);
  }
}