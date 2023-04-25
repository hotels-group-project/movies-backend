import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TransferService } from './transfer.service';

@Controller()
export class TransferController {

    constructor(private readonly minerService: TransferService) {}

    @MessagePattern('transfer_data_to_db')
    transferData(){
        return this.minerService.moveFilmsIntoDb();
  }
}
