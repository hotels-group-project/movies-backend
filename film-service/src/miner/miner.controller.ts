import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MinerService } from './miner.service';

@Controller()
export class MinerController {

    constructor(private readonly minerService: MinerService) {}

    @MessagePattern('mine_films')
    mineFilms(){
    return this.minerService.mineFilms();
  }
}
