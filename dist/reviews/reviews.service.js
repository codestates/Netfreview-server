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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const LikeReview_entity_1 = require("../entity/LikeReview.entity");
const Review_entity_1 = require("../entity/Review.entity");
const User_entity_1 = require("../entity/User.entity");
const Video_entity_1 = require("../entity/Video.entity");
const typeorm_2 = require("typeorm");
let ReviewsService = class ReviewsService {
    constructor(reviewRepository, likeRepository, userRepository, videoRepository) {
        this.reviewRepository = reviewRepository;
        this.likeRepository = likeRepository;
        this.userRepository = userRepository;
        this.videoRepository = videoRepository;
        this.reviewRepository = reviewRepository;
        this.likeRepository = likeRepository;
        this.userRepository = userRepository;
        this.videoRepository = videoRepository;
    }
    async getThisVidReviewAvgRate(videoId) {
        const avgRating = await this.reviewRepository
            .createQueryBuilder('review')
            .leftJoinAndSelect('review.video', 'video')
            .where('video.id = :videoId', { videoId })
            .select('AVG(review.rating)', 'avg')
            .getRawOne();
        if (avgRating === null)
            return 0;
        else
            return Number(avgRating.avg);
    }
    async addOrRemoveLike(user, review) {
        const userLike = await this.likeRepository.findOne({ user, review });
        if (userLike) {
            await this.likeRepository.delete({ user, review });
            const likeCount = await this.likeRepository.count({ review });
            const isLike = await this.likeRepository.count({
                user,
                review,
            });
            const returnReview = Object.assign(Object.assign({}, review), { likeCount, isLike });
            return Object.assign({
                review: returnReview,
                message: 'Success deleted',
            });
        }
        else {
            const likeReview = new LikeReview_entity_1.LikeReview();
            likeReview.user = user;
            likeReview.review = review;
            await this.likeRepository.save(likeReview);
            const likeCount = await this.likeRepository.count({ review });
            const isLike = await this.likeRepository.count({
                user,
                review,
            });
            const returnReview = Object.assign(Object.assign({}, review), { likeCount, isLike });
            return Object.assign({
                review: returnReview,
                message: 'Success created',
            });
        }
    }
    async findReviewWithId(reviewId) {
        return await this.reviewRepository
            .createQueryBuilder('review')
            .where('review.id = :id', { id: reviewId })
            .leftJoinAndSelect('review.user', 'user')
            .getOne();
    }
    async test(id) {
        const rawVideoList = await this.reviewRepository
            .createQueryBuilder('review')
            .select('*')
            .addSelect('COUNT(*)', 'likeCount')
            .where('reviewId = review.id')
            .from(LikeReview_entity_1.LikeReview, 'like')
            .groupBy('review.id')
            .orderBy('likeCount', 'DESC')
            .getRawMany();
        console.log(rawVideoList);
    }
    async findThisVidAndUserReview(video, user) {
        if (user === 'guest') {
            user = await this.userRepository.findOne({ name: 'guest' });
        }
        const rawVideoList = await this.reviewRepository
            .createQueryBuilder('review')
            .select('review')
            .addSelect('COUNT(likeReview.id) as likeCount')
            .leftJoin('review.likeReview', 'likeReview')
            .where({ video })
            .groupBy('review.id')
            .orderBy('likeCount', 'DESC')
            .getRawMany();
        console.log(rawVideoList);
        const userReview = await this.reviewRepository.findOne({ user, video });
        const videoList = [];
        if (rawVideoList.length) {
            for (const rawReview of rawVideoList) {
                const review = await this.reviewRepository
                    .createQueryBuilder('review')
                    .select('review')
                    .where('review.id =:id', { id: rawReview.id })
                    .getOne();
                if (userReview && rawReview.id === userReview.id)
                    continue;
                const likeCount = rawReview.likeCount;
                const isLike = await this.likeRepository.count({ user, review });
                videoList.push({
                    id: rawReview.review_id,
                    rating: rawReview.review_rating,
                    text: rawReview.review_text,
                    createdAt: rawReview.review_createdAt,
                    updatedAt: rawReview.review_updatedAt,
                    userId: rawReview.review_userId,
                    videoId: rawReview.review_videoId,
                    likeCount,
                    isLike,
                });
            }
        }
        else {
            return { videoList, userReview: null };
        }
        if (!userReview) {
            return {
                videoList,
                userReview: null,
            };
        }
        const resultUserReview = Object.assign(Object.assign({}, userReview), { likeCount: await this.likeRepository.count({ review: userReview }), isLike: await this.likeRepository.count({ user, review: userReview }) });
        return { videoList, resultUserReview };
    }
    async saveReview(user, video, req) {
        const isExist = await this.reviewRepository.findOne({ user, video });
        if (isExist) {
            throw new common_1.UnprocessableEntityException('이미 리뷰가 존재합니다!.');
        }
        else {
            const reviews = new Review_entity_1.Review();
            reviews.text = req.text;
            reviews.rating = req.rating;
            reviews.user = user;
            reviews.video = video;
            await this.reviewRepository.save(reviews);
            delete reviews.user;
            delete reviews.video;
            const returnReview = Object.assign(Object.assign({}, reviews), { likeCount: 0, isLike: 0 });
            return Object.assign({
                myReview: returnReview,
                message: '리뷰가 등록되었습니다.',
            });
        }
    }
    async deleteReview(id) {
        await this.reviewRepository.delete({ id: id });
    }
    async patchReview(user, video, req) {
        const review = await this.reviewRepository.findOne({ user, video });
        const id = review.id;
        const likeCount = await this.likeRepository.count({ review });
        const isLike = await this.likeRepository.count({
            user,
            review,
        });
        await this.deleteReview(id);
        const thisreview = {
            id,
            text: req.text,
            rating: req.rating,
            user,
            video,
        };
        await this.reviewRepository.save(thisreview);
        delete thisreview.user;
        delete thisreview.video;
        return Object.assign({
            myReview: Object.assign(Object.assign({}, thisreview), { likeCount,
                isLike }),
            message: '리뷰가 등록되었습니다.',
        });
    }
};
ReviewsService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(Review_entity_1.Review)),
    __param(1, typeorm_1.InjectRepository(LikeReview_entity_1.LikeReview)),
    __param(2, typeorm_1.InjectRepository(User_entity_1.User)),
    __param(3, typeorm_1.InjectRepository(Video_entity_1.Video)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReviewsService);
exports.ReviewsService = ReviewsService;
//# sourceMappingURL=reviews.service.js.map