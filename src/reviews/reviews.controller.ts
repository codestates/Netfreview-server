import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenService } from 'src/auth/token.service';
import { UsersService } from 'src/users/users.service';
import { VideosService } from 'src/videos/videos.service';
import { ReviewDto } from './dto/postReviewDto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private reviewsService: ReviewsService,
    private videosService: VideosService,
    private tokenService: TokenService,
    private usersService: UsersService,
  ) {
    this.reviewsService = reviewsService;
    this.videosService = videosService;
    this.tokenService = tokenService;
    this.usersService = usersService;
  }

  @Get('test')
  async test() {
    await this.reviewsService.test(1);
  }

  @UseGuards(JwtAuthGuard)
  @Post('like')
  async likeThisReview(@Body() body, @Request() req) {
    const user = req.user;
    const review = await this.reviewsService.findReviewWithId(body.reviewId);
    if (!review) {
      throw new NotFoundException('존재하지 않는 리뷰입니다.');
    }
    return await this.reviewsService.addOrRemoveLike(user, review);
  }

  @Get(':videoId')
  async findThisVidReview(
    @Param('videoId') videoId: number,
    @Query('page') page: number,
    @Headers() header,
  ): Promise<void> {
    let accessToken = null;
    let myuser;

    if (header.authorization) {
      const rawAccessToken = header.authorization.slice(7);
      accessToken = await this.tokenService.resolveAccessToken(rawAccessToken);
      if (accessToken) {
        const { email } = accessToken;
        const { iat } = accessToken;
        const accessTokenIat = new Date(iat * 1000 + 1000);
        myuser = await this.usersService.findUserWithEmail(email);
        if (myuser.lastLogin > accessTokenIat) accessToken = null;
      }
    }

    if (typeof Number(page) !== 'number' || Number(page) <= 0 || !page) {
      throw new NotFoundException(
        '페이지를 입력받지 못했거나 숫자형태가 아니거나 0이하로 받았습니다.',
      );
    }

    const video = await this.videosService.findVidWithId(videoId);

    if (!accessToken) {
      myuser = 'guest';
    }
    // console.log(myuser);

    const {
      videoList,
      resultUserReview,
    } = await this.reviewsService.findThisVidAndUserReview(video, myuser);
    // console.log(videoList);
    let totalCount = videoList.length;
    if (resultUserReview) {
      totalCount++;
    }

    return Object.assign({
      totalCount,
      reviewList: videoList.slice(8 * (page - 1), 8 * page),
      myReview: resultUserReview || null,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async saveReview(@Body() body: ReviewDto, @Request() request): Promise<void> {
    const user = request.user;
    if (!body.videoId || !body.text || !body.rating) {
      throw new BadRequestException(
        'text 혹은 rating 혹은 videoId가 전달되지 않았습니다.',
      );
    }
    const video = await this.videosService.findVidWithId(body.videoId);
    return await this.reviewsService.saveReview(user, video, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteReview(@Body() body) {
    await this.reviewsService.deleteReview(body.reviewId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async patchReview(@Body() body: ReviewDto, @Request() req): Promise<void> {
    const user = req.user;
    const video = await this.videosService.findVidWithId(body.videoId);
    return await this.reviewsService.patchReview(user, video, body);
  }
}
