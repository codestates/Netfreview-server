import { Image } from './Image.entity';
import { LikeReview } from './LikeReview.entity';
import { RefreshToken } from './RefreshToken.entity';
import { Review } from './Review.entity';
export declare class User {
    id: string;
    email: string;
    name: string;
    password: string;
    profileUrl: string | null;
    introduction: string | null;
    nickname: string;
    lastLogin: Date;
    image: Image;
    likeReview: LikeReview;
    refreshToken: RefreshToken;
    reviews: Review[];
    createdAt: Date;
    updatedAt: Date;
}
