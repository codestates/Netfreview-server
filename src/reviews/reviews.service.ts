import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeReview } from 'src/entity/LikeReview.entity';
import { Review } from 'src/entity/Review.entity';
import { User } from 'src/entity/User.entity';
import { Video } from 'src/entity/Video.entity';
import { Repository } from 'typeorm';
import { ReviewDto } from './dto/postReviewDto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    @InjectRepository(LikeReview)
    private likeRepository: Repository<LikeReview>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Video) private videoRepository: Repository<Video>,
  ) {
    this.reviewRepository = reviewRepository;
    this.likeRepository = likeRepository;
    this.userRepository = userRepository;
    this.videoRepository = videoRepository;
  }

  async getThisVidReviewAvgRate(videoId: number) {
    // 비디오 컨트롤러에서 평균 별점을 낼 때 사용하는 로직
    const avgRating = await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.video', 'video')
      .where('video.id = :videoId', { videoId })
      .select('AVG(review.rating)', 'avg')
      .getRawOne();

    if (avgRating === null) return 0;
    else return Number(avgRating.avg);

    // const thisVideo = await this.videoRepository.findOne({ id: videoId });
    // const thisVidReviewList = await this.reviewRepository.find({
    //   video: thisVideo,
    // });
    // if (thisVidReviewList.length === 0) {
    //   return 0;
    // }
    // const count = thisVidReviewList.length;
    // let sum = 0;
    // thisVidReviewList.map((review) => {
    //   sum += review.rating;
    // });

    // return sum / count;
  }

  async addOrRemoveLike(user: User, review: Review) {
    const userLike = await this.likeRepository.findOne({ user, review });
    if (userLike) {
      await this.likeRepository.delete({ user, review });
      const likeCount = await this.likeRepository.count({ review });
      const isLike = await this.likeRepository.count({
        user,
        review,
      });
      const returnReview = { ...review, likeCount, isLike };
      return Object.assign({
        review: returnReview,
        message: 'Success deleted',
      });
    } else {
      const likeReview = new LikeReview();
      likeReview.user = user;
      likeReview.review = review;
      await this.likeRepository.save(likeReview);
      const likeCount = await this.likeRepository.count({ review });
      const isLike = await this.likeRepository.count({
        user,
        review,
      });
      const returnReview = { ...review, likeCount, isLike };
      return Object.assign({
        review: returnReview,
        message: 'Success created',
      });
    }
  }

  async findReviewWithId(reviewId: number) {
    return await this.reviewRepository
      .createQueryBuilder('review')
      .where('review.id = :id', { id: reviewId })
      .leftJoinAndSelect('review.user', 'user')
      .getOne();
  }

  async test(id, userId) {
    const rawVideoList = await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .addSelect('')
      .where('review.video.id = :id', { id })
      .andWhere('user.id != :id', { id: userId })
      .orderBy('review.createdAt', 'DESC')
      .getMany();

    console.log(rawVideoList);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async findThisVidAndUserReview(video: any, user) {
    if (user === 'guest') {
      user = await this.userRepository.findOne({ name: 'guest' });
    }
    const rawVideoList = await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .where({ video })
      .andWhere('user.id != :id', { id: user.id })
      .orderBy('review.createdAt', 'DESC')
      .getMany();
    const videoList = [];

    if (rawVideoList.length) {
      for (const review of rawVideoList) {
        delete review.user.password;
        const likeCount = await this.likeRepository.count({ review });
        const isLike = await this.likeRepository.count({ user, review });
        videoList.push({
          ...review,
          likeCount,
          isLike,
        });
      }
    } else {
      return { videoList, userReview: null };
    }

    const rawUserReview = await this.reviewRepository.findOne({ video, user });
    if (!rawUserReview) {
      return {
        videoList,
        userReview: null,
      };
    }

    const userReview = {
      ...rawUserReview,
      likeCount: await this.likeRepository.count({ review: rawUserReview }),
      isLike: await this.likeRepository.count({ user, review: rawUserReview }),
      reviewId: rawUserReview.id,
    };
    return { videoList, userReview };
  }

  async saveReview(user: User, video: Video, req: ReviewDto) {
    const isExist = await this.reviewRepository.findOne({ user, video });
    if (isExist) {
      throw new UnprocessableEntityException('이미 리뷰가 존재합니다!.');
    } else {
      const reviews = new Review();
      reviews.text = req.text;
      reviews.rating = req.rating;
      reviews.user = user;
      reviews.video = video;
      await this.reviewRepository.save(reviews);
      delete reviews.user;
      delete reviews.video;
      const returnReview = {
        ...reviews,
        likeCount: 0,
        isLike: 0,
      };
      return Object.assign({
        myReview: returnReview,
        message: '리뷰가 등록되었습니다.',
      });
    }
  }

  async deleteReview(id: number) {
    await this.reviewRepository.delete({ id: id });
  }

  async patchReview(user: User, video: Video, req: ReviewDto) {
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
      myReview: {
        ...thisreview,
        likeCount,
        isLike,
      },
      message: '리뷰가 등록되었습니다.',
    });
  }
}
