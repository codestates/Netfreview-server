import { LikeReview } from 'src/entity/LikeReview.entity';
import { Review } from 'src/entity/Review.entity';
import { User } from 'src/entity/User.entity';
import { Video } from 'src/entity/Video.entity';
import { Repository } from 'typeorm';
import { ReviewDto } from './dto/postReviewDto';
export declare class ReviewsService {
    private reviewRepository;
    private likeRepository;
    private userRepository;
    private videoRepository;
    constructor(reviewRepository: Repository<Review>, likeRepository: Repository<LikeReview>, userRepository: Repository<User>, videoRepository: Repository<Video>);
    getReviewKing(): Promise<Review>;
    getThisVidReviewAvgRate(videoId: number): Promise<number>;
    addOrRemoveLike(user: User, review: Review): Promise<any>;
    findReviewWithId(reviewId: number): Promise<Review>;
    findThisVidAndUserReview(video: any, user: any): Promise<{
        videoList: any[];
        userReview: any;
        resultUserReview?: undefined;
    } | {
        videoList: any[];
        resultUserReview: {
            likeCount: number;
            isLike: number;
            id: number;
            rating: number;
            text: string;
            likeReview: LikeReview;
            user: User;
            video: Video;
            createdAt: Date;
            updatedAt: Date;
        };
        userReview?: undefined;
    }>;
    saveReview(user: User, video: Video, req: ReviewDto): Promise<any>;
    deleteReview(id: number): Promise<void>;
    patchReview(user: User, video: Video, req: ReviewDto): Promise<any>;
}
