import { Genre } from './Genre.entity';
import { Review } from './Review.entity';
export declare class Video {
    id: number;
    title: string;
    description: string;
    director: string;
    actor: string;
    ageLimit: string;
    releaseYear: string;
    posterUrl: string;
    bannerUrl: string;
    netflixUrl: string;
    type: string;
    reviews: Review[];
    genres: Genre[];
    createdAt: string;
    updatedAt: string;
}
