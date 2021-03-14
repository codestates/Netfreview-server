import { ReviewsService } from 'src/reviews/reviews.service';
import { UsersService } from 'src/users/users.service';
import { VideosService } from './videos.service';
import { TokenService } from '../auth/token.service';
export declare class VideosController {
    private videosService;
    private reviewsService;
    private usersService;
    private tokenService;
    constructor(videosService: VideosService, reviewsService: ReviewsService, usersService: UsersService, tokenService: TokenService);
    getVideoList(path: string, q: string, header: any): Promise<any>;
    getThisVideo(videoId: number): Promise<any>;
    addVideo(body: any, req: any): Promise<any>;
}
