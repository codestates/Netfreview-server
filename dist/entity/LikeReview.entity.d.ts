import { Review } from './Review.entity';
import { User } from './User.entity';
export declare class LikeReview {
    id: number;
    review: Review;
    user: User;
}
