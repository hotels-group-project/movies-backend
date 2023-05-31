import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Film } from '../film/film.model';
import { Review } from './review.model';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports : [    
    SequelizeModule.forFeature([Film, Review]),     
  ],
})
export class ReviewModule {}
