"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const Genre_entity_1 = require("../entity/Genre.entity");
const Review_entity_1 = require("../entity/Review.entity");
const Video_entity_1 = require("../entity/Video.entity");
const typeorm_2 = require("typeorm");
const videoData = require("./videoData.json");
let VideosService = class VideosService {
    constructor(videoRepository, genreRepository, reviewRepository) {
        this.videoRepository = videoRepository;
        this.genreRepository = genreRepository;
        this.reviewRepository = reviewRepository;
        this.videoRepository = videoRepository;
        this.genreRepository = genreRepository;
        this.reviewRepository = reviewRepository;
    }
    async findVidWithId(videoId) {
        return await this.videoRepository.findOne({ id: videoId });
    }
    async addThisVideo(newVideo) {
        const genreBox = [];
        const video = new Video_entity_1.Video();
        video.title = newVideo.title;
        video.actor = newVideo.actor.join(',');
        video.ageLimit = String(newVideo.ageLimit);
        video.bannerUrl = newVideo.bannerUrl;
        video.description = newVideo.description;
        video.director = newVideo.director.join(',');
        video.netflixUrl = newVideo.netflixUrl;
        video.posterUrl = newVideo.posterUrl;
        video.releaseYear = newVideo.releaseYear;
        video.type = newVideo.type;
        video.genres = genreBox;
        for (const genre of newVideo.genres) {
            const isGenre = await this.genreRepository.findOne({ name: genre });
            if (!isGenre) {
                const newGenre = new Genre_entity_1.Genre();
                newGenre.name = genre;
                await this.genreRepository.save(newGenre);
                genreBox.push(newGenre);
            }
            else {
                genreBox.push(isGenre);
            }
            await this.videoRepository.save(video);
        }
        return Object.assign({
            message: 'your video added',
            data: video,
        });
    }
    async getThisVideoWithId(videoId) {
        return this.videoRepository.findOne({ id: videoId });
    }
    async getThisVidGenreWithId(videoId) {
        const video = await this.videoRepository
            .createQueryBuilder('video')
            .leftJoinAndSelect('video.genres', 'genre')
            .where({ id: videoId })
            .getOne();
        return video.genres;
    }
    async getUserVideo(userId) {
        const reviews = await this.reviewRepository
            .createQueryBuilder('review')
            .leftJoinAndSelect('review.user', 'user')
            .leftJoinAndSelect('review.video', 'video')
            .getMany();
        const myVideoBox = [];
        for (const review of reviews) {
            if (review.user.id === userId) {
                delete review.user;
                myVideoBox.push(review.video);
            }
        }
        return myVideoBox;
    }
    async getUserAboutThis(videoIds, userId) {
        const userCountObj = {};
        const similarUserIdBox = [];
        const resultRecommandVideoBox = [];
        let previousCount = 0;
        for (const videoId of videoIds) {
            const video = await this.videoRepository
                .createQueryBuilder('video')
                .leftJoinAndSelect('video.reviews', 'review')
                .leftJoinAndSelect('review.user', 'user')
                .where({ id: videoId })
                .getOne();
            for (const review of video.reviews) {
                if (review.user.id === userId)
                    continue;
                const isUser = userCountObj[`${review.user.id}`];
                if (isUser)
                    userCountObj[`${review.user.id}`]++;
                else
                    userCountObj[`${review.user.id}`] = 1;
            }
        }
        for (const key in userCountObj) {
            if (userCountObj[key] > previousCount)
                similarUserIdBox.unshift(key);
            else
                similarUserIdBox.push(key);
            previousCount = userCountObj[key];
            if (similarUserIdBox.length > 3)
                break;
        }
        for (const user of similarUserIdBox) {
            const thisUserVideo = await this.getUserVideo(user);
            for (const video of thisUserVideo) {
                if (videoIds.includes(video.id))
                    continue;
                if (!resultRecommandVideoBox.length) {
                    resultRecommandVideoBox.push(video);
                    continue;
                }
                let isExist = false;
                for (const boxVideo of resultRecommandVideoBox) {
                    if (boxVideo.id === video.id)
                        isExist = true;
                }
                if (!isExist)
                    resultRecommandVideoBox.push(video);
            }
        }
        return resultRecommandVideoBox;
    }
    async getSearchVideo(q) {
        if (q) {
            const videoList = await this.videoRepository
                .createQueryBuilder('video')
                .where('video.title like :title', { title: `%${q}%` })
                .getMany();
            return videoList;
        }
        return await this.videoRepository.find();
    }
    async getAllVideoWithReview() {
        return await this.videoRepository
            .createQueryBuilder('video')
            .leftJoinAndSelect('video.reviews', 'review')
            .getMany();
    }
    async getAllVideoId() {
        const videoIdList = await this.videoRepository
            .createQueryBuilder('video')
            .select('video.id')
            .getMany();
        return videoIdList;
    }
    async saveDummyVideo() {
        for (const video of videoData.data) {
            await this.addThisVideo(video);
        }
        return 'success ADD!';
    }
    async getManyReviewVid() {
        const videoList = await this.videoRepository
            .createQueryBuilder('video')
            .select('video.id')
            .leftJoin('video.reviews', 'review')
            .addSelect(`COUNT('reviews')`, 'count')
            .groupBy('video.id')
            .orderBy('count', 'DESC')
            .limit(5)
            .getRawMany();
        return videoList;
    }
    async getLessReviewVid() {
        const videoList = await this.videoRepository
            .createQueryBuilder('video')
            .select('video')
            .leftJoin('video.reviews', 'review')
            .addSelect(`COUNT('reviews')`, 'count')
            .groupBy('video.id')
            .orderBy('count')
            .limit(5)
            .getRawMany();
        return videoList;
    }
    async getTop5ReviewVid() {
        const videoList = await this.videoRepository
            .createQueryBuilder('video')
            .select('video.id')
            .addSelect('AVG(rating)', 'rating')
            .where('videoId = video.id')
            .from(Review_entity_1.Review, 'reviews')
            .groupBy('video.id')
            .orderBy('rating', 'DESC')
            .limit(5)
            .getRawMany();
        return videoList;
    }
};
VideosService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(Video_entity_1.Video)),
    __param(1, typeorm_1.InjectRepository(Genre_entity_1.Genre)),
    __param(2, typeorm_1.InjectRepository(Review_entity_1.Review)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], VideosService);
exports.VideosService = VideosService;
//# sourceMappingURL=videos.service.js.map