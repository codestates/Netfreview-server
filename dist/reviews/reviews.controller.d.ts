import { TokenService } from 'src/auth/token.service';
import { UsersService } from 'src/users/users.service';
import { VideosService } from 'src/videos/videos.service';
import { ReviewDto } from './dto/postReviewDto';
import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private reviewsService;
    private videosService;
    private tokenService;
    private usersService;
    constructor(reviewsService: ReviewsService, videosService: VideosService, tokenService: TokenService, usersService: UsersService);
    getReviewKing(): Promise<any>;
    likeThisReview(body: any, req: any): Promise<any>;
    findThisVidReview(videoId: number, page: number, header: any): Promise<void>;
    saveReview(body: ReviewDto, request: any): Promise<void>;
    deleteReview(body: any, req: any): Promise<string>;
    patchReview(body: ReviewDto, req: any): Promise<void>;
}
