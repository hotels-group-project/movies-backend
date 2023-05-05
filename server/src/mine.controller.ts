import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('transfer')
export class MineController {
  constructor(@Inject('FILM_SERVICE') private readonly client: ClientProxy) {}  
  
  @ApiExcludeEndpoint()
  @Get()
  transferDataFromDataFolderToDb() {
    return this.client.send('transfer_data_to_db', '');
  }
}
