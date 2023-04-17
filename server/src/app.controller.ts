import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller()
export class AppController {
  constructor(@Inject('FILM_SERVICE') private readonly client: ClientProxy) {}

  @Get('film/:id')
  getFilm(@Param('id') id: number): Observable<string> {
    return this.client.send('get_film', id);
  }
}
