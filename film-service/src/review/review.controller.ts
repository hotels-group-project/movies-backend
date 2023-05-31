import { Controller } from '@nestjs/common';
import { ReviewService } from './review.service';
import { MessagePattern } from '@nestjs/microservices';
import { ReviewCreationAttr } from './dto/add-review.dto';
import { Review } from './review.model';

@Controller('review')
export class ReviewController {
    constructor (private readonly reviewService: ReviewService) {}

    @MessagePattern('add_review')
    addReview(addReviewDto : ReviewCreationAttr) : Promise<Review> {
        return this.reviewService.addReview(addReviewDto);
    }  

    @MessagePattern('delete_review')
    deleteReview(id : number) {
        return this.reviewService.deleteReview(id);
    }  
}