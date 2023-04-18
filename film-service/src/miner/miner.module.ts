import { Module } from '@nestjs/common';
import { MinerService } from './miner.service';
import { MinerController } from './miner.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [MinerService],
  controllers: [MinerController],
  imports: [HttpModule]
})
export class MinerModule {}
