import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('mine')
export class MineController {
  constructor(@Inject('FILM_SERVICE') private readonly client: ClientProxy) {}  

  @Get()
  mineFilms() {
    return this.client.send('mine_films', '');
  }
}
