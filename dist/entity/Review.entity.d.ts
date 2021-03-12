import { LikeReview } from './LikeReview.entity';
import { User } from './User.entity';
import { Video } from './Video.entity';
export declare class Review {
    id: number;
    rating: number;
    text: string;
    likeReview: LikeReview;
    user: User;
    video: Video;
    createdAt: Date;
    updatedAt: Date;
}
