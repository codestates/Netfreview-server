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
exports.VideosController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const reviews_service_1 = require("../reviews/reviews.service");
const users_service_1 = require("../users/users.service");
const videos_service_1 = require("./videos.service");
const token_service_1 = require("../auth/token.service");
let VideosController = class VideosController {
    constructor(videosService, reviewsService, usersService, tokenService) {
        this.videosService = videosService;
        this.reviewsService = reviewsService;
        this.usersService = usersService;
        this.tokenService = tokenService;
        this.videosService = videosService;
        this.reviewsService = reviewsService;
        this.usersService = usersService;
        this.tokenService = tokenService;
    }
    async getVideoList(path, q, header) {
        let accessToken = null;
        let user = null;
        if (header.authorization) {
            const rawAccessToken = header.authorization.slice(7);
            accessToken = await this.tokenService.resolveAccessToken(rawAccessToken);
            if (accessToken) {
                const { email } = accessToken;
                const { iat } = accessToken;
                const accessTokenIat = new Date(iat * 1000 + 1000);
                user = await this.usersService.findUserWithEmail(email);
                if (user.lastLogin > accessTokenIat)
                    accessToken = null;
            }
        }
        if (path === 'myPage') {
            if (!accessToken) {
                throw new common_1.UnauthorizedException('로그인 후 이용 가능합니다.');
            }
            const videoList = await this.videosService.getUserVideo(user.id);
            const myPageVideoList = [];
            for (const video of videoList) {
                const avgRating = await this.reviewsService.getThisVidReviewAvgRate(video.id);
                myPageVideoList.push(Object.assign(Object.assign({}, video), { rating: avgRating }));
            }
            return Object.assign({
                videoList: myPageVideoList,
            });
        }
        else if (path === 'aboutThis') {
            if (!accessToken) {
                throw new common_1.UnauthorizedException('로그인 후 이용 가능합니다.');
            }
            const userId = user.id;
            const videoList = await this.videosService.getUserVideo(userId);
            if (!videoList || videoList.length !== 0) {
                const videoList3 = await this.videosService.getTop5ReviewVid();
                const top5ReviewVidBox = [];
                for (const video of videoList3) {
                    const topVid = await this.videosService.getThisVideoWithId(video.id);
                    const avgRating = await this.reviewsService.getThisVidReviewAvgRate(video.id);
                    top5ReviewVidBox.push(Object.assign(Object.assign({}, topVid), { rating: avgRating }));
                }
                return Object.assign({
                    videoList: top5ReviewVidBox.slice(0, 4),
                    message: '유저의 리뷰가 없어서 메인페이지 top5 비디오리스트를 보냄',
                });
            }
            const videoIds = [];
            for (const video of videoList) {
                videoIds.push(video.id);
            }
            const aboutThisVid = await this.videosService.getUserAboutThis(videoIds, userId);
            const returnVideoList = aboutThisVid.slice(0, 4);
            const aboutThisVidList = [];
            for (const rawVideo of returnVideoList) {
                const avgRating = await this.reviewsService.getThisVidReviewAvgRate(rawVideo.id);
                const video = Object.assign(Object.assign({}, rawVideo), { rating: avgRating });
                aboutThisVidList.push(video);
            }
            return Object.assign({
                videoList: aboutThisVidList,
            });
        }
        else if (path === 'main') {
            const videoList = await this.videosService.getManyReviewVid();
            const many5ReviewVidBox = [];
            for (const video of videoList) {
                const manyVid = await this.videosService.getThisVideoWithId(video.video_id);
                const avgRating = await this.reviewsService.getThisVidReviewAvgRate(video.video_id);
                many5ReviewVidBox.push(Object.assign(Object.assign({}, manyVid), { rating: avgRating }));
            }
            const videoList2 = await this.videosService.getLessReviewVid();
            const less5ReviewVidBox = [];
            for (const video of videoList2) {
                const lowVid = await this.videosService.getThisVideoWithId(video.video_id);
                const avgRating = await this.reviewsService.getThisVidReviewAvgRate(video.video_id);
                less5ReviewVidBox.push(Object.assign(Object.assign({}, lowVid), { rating: avgRating }));
            }
            const videoList3 = await this.videosService.getTop5ReviewVid();
            const top5ReviewVidBox = [];
            for (const video of videoList3) {
                const topVid = await this.videosService.getThisVideoWithId(video.id);
                const avgRating = await this.reviewsService.getThisVidReviewAvgRate(video.id);
                top5ReviewVidBox.push(Object.assign(Object.assign({}, topVid), { rating: avgRating }));
            }
            return Object.assign({
                top5VideoList: top5ReviewVidBox,
                mostReviewVidList: many5ReviewVidBox,
                lessReviewVidList: less5ReviewVidBox,
                message: '메인페이지 비디오 리스트 모음',
            });
        }
        if (q) {
            const allVideolist = await this.videosService.getSearchVideo(q);
            const videoList = [];
            for (const video of allVideolist) {
                const rating = await this.reviewsService.getThisVidReviewAvgRate(video.id);
                videoList.push(Object.assign(Object.assign({}, video), { rating }));
            }
            return Object.assign({
                videoList,
            });
        }
        else {
            throw new common_1.BadRequestException('잘못된 경로의 요청입니다. Path를 확인해주세요');
        }
    }
    async getThisVideo(videoId) {
        const rawVideoData = await this.videosService.findVidWithId(videoId);
        const avgRating = await this.reviewsService.getThisVidReviewAvgRate(videoId);
        if (!rawVideoData)
            throw new common_1.BadRequestException('해당 비디오가 없습니다.');
        const genres = await this.videosService.getThisVidGenreWithId(videoId);
        const genreBucket = [];
        for (const genre of genres) {
            genreBucket.push(genre.name);
        }
        return Object.assign(Object.assign(Object.assign({}, rawVideoData), { rating: avgRating, genres: genreBucket }));
    }
    async addVideo(body) {
        return await this.videosService.addThisVideo(body);
    }
};
__decorate([
    common_1.Get('/videolist'),
    __param(0, common_1.Query('path')),
    __param(1, common_1.Query('q')),
    __param(2, common_1.Headers()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "getVideoList", null);
__decorate([
    common_1.Get(':videoId'),
    __param(0, common_1.Param('videoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "getThisVideo", null);
__decorate([
    common_1.Post('add'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "addVideo", null);
VideosController = __decorate([
    common_1.Controller('videos'),
    __metadata("design:paramtypes", [videos_service_1.VideosService,
        reviews_service_1.ReviewsService,
        users_service_1.UsersService,
        token_service_1.TokenService])
], VideosController);
exports.VideosController = VideosController;
//# sourceMappingURL=videos.controller.js.map