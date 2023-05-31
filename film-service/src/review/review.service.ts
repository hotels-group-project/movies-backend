import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from './review.model';
import { ReviewCreationAttr } from './dto/add-review.dto';

@Injectable()
export class ReviewService {
    constructor(@InjectModel(Review) private reviewRepository : typeof Review){}
    
    async addReview(addReviewDto : ReviewCreationAttr) : Promise<Review> {
        return await this.reviewRepository.create(addReviewDto);
    }

    async deleteReview(id : number) {
        await this.reviewRepository.destroy({where : {review_id : id}})
        return {message : 'success'};
    }
}
