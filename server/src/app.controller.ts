import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller()
export class AppController {
  constructor(@Inject('FILM_SERVICE') private readonly client: ClientProxy) {}

  @Get('')
  getHello(): Observable<string> {
    return this.client.send('sayhello', '');
  }
}
