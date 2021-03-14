import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ReviewsService } from 'src/reviews/reviews.service';
import { UsersService } from 'src/users/users.service';
import { VideosService } from './videos.service';
import { TokenService } from '../auth/token.service';

@Controller('videos')
export class VideosController {
  constructor(
    private videosService: VideosService,
    private reviewsService: ReviewsService,
    private usersService: UsersService,
    private tokenService: TokenService,
  ) {
    this.videosService = videosService;
    this.reviewsService = reviewsService;
    this.usersService = usersService;
    this.tokenService = tokenService;
  }

  @Get('/videolist')
  async getVideoList(
    @Query('path') path: string,
    @Query('q') q: string,
    @Headers() header,
  ) {
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
        if (user.lastLogin > accessTokenIat) accessToken = null;
      }
    }

    if (path === 'myPage') {
      if (!accessToken) {
        throw new UnauthorizedException('로그인 후 이용 가능합니다.');
      }
      const videoList = await this.videosService.getUserVideo(user.id);
      const myPageVideoList = [];
      for (const video of videoList) {
        const avgRating = await this.reviewsService.getThisVidReviewAvgRate(
          video.id,
        );
        myPageVideoList.push({
          ...video,
          rating: avgRating,
        });
      }
      return Object.assign({
        videoList: myPageVideoList,
      });
    } else if (path === 'aboutThis') {
      if (!accessToken) {
        throw new UnauthorizedException('로그인 후 이용 가능합니다.');
      }
      const userId = user.id;
      const videoList = await this.videosService.getUserVideo(userId);
      if (!videoList || videoList.length === 0) {
        // const videoList3 = await this.videosService.getTop5ReviewVid();
        // const top5ReviewVidBox = [];
        // for (const video of videoList3) {
        //   const topVid = await this.videosService.getThisVideoWithId(video.id);
        //   const avgRating = await this.reviewsService.getThisVidReviewAvgRate(
        //     video.id,
        //   );
        //   top5ReviewVidBox.push({
        //     ...topVid,
        //     rating: avgRating,
        //   });
        // }
        return Object.assign({
          videoList: [],
          message: '유저의 리뷰가 없습니다',
        });
      }

      const videoIds = [];
      for (const video of videoList) {
        videoIds.push(video.id);
      }
      const aboutThisVid = await this.videosService.getUserAboutThis(
        videoIds,
        userId,
      );
      const returnVideoList = aboutThisVid.slice(0, 4);
      const aboutThisVidList = [];
      for (const rawVideo of returnVideoList) {
        const avgRating = await this.reviewsService.getThisVidReviewAvgRate(
          rawVideo.id,
        );
        const video = { ...rawVideo, rating: avgRating };
        aboutThisVidList.push(video);
      }
      return Object.assign({
        videoList: aboutThisVidList,
      });
    } else if (path === 'main') {
      const videoList = await this.videosService.getManyReviewVid();
      const many5ReviewVidBox = [];
      for (const video of videoList) {
        const manyVid = await this.videosService.getThisVideoWithId(
          video.video_id,
        );
        const avgRating = await this.reviewsService.getThisVidReviewAvgRate(
          video.video_id,
        );
        many5ReviewVidBox.push({
          ...manyVid,
          rating: avgRating,
        });
      }

      const videoList2 = await this.videosService.getLessReviewVid();
      const less5ReviewVidBox = [];
      for (const video of videoList2) {
        const lowVid = await this.videosService.getThisVideoWithId(
          video.video_id,
        );
        const avgRating = await this.reviewsService.getThisVidReviewAvgRate(
          video.video_id,
        );
        less5ReviewVidBox.push({
          ...lowVid,
          rating: avgRating,
        });
      }
      const videoList3 = await this.videosService.getTop5ReviewVid();
      const top5ReviewVidBox = [];
      for (const video of videoList3) {
        const topVid = await this.videosService.getThisVideoWithId(video.id);
        const avgRating = await this.reviewsService.getThisVidReviewAvgRate(
          video.id,
        );
        top5ReviewVidBox.push({
          ...topVid,
          rating: avgRating,
        });
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
        const rating = await this.reviewsService.getThisVidReviewAvgRate(
          video.id,
        );
        videoList.push({ ...video, rating });
      }
      return Object.assign({
        videoList,
      });
    } else {
      throw new BadRequestException(
        '잘못된 경로의 요청입니다. Path를 확인해주세요',
      );
    }
  }

  @Get(':videoId')
  async getThisVideo(@Param('videoId') videoId: number) {
    const rawVideoData = await this.videosService.findVidWithId(videoId);
    const avgRating = await this.reviewsService.getThisVidReviewAvgRate(
      videoId,
    );
    if (!rawVideoData) throw new BadRequestException('해당 비디오가 없습니다.');

    const genres = await this.videosService.getThisVidGenreWithId(videoId);
    const genreBucket = [];
    for (const genre of genres) {
      genreBucket.push(genre.name);
    }
    return Object.assign({
      ...rawVideoData,
      rating: avgRating,
      genres: genreBucket,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addVideo(@Body() body, @Request() req) {
    const user = req.user;
    const admin = await this.usersService.findUserWithName('admin');
    delete admin.password;

    if (user.id === admin.id && user.email === admin.email) {
      return await this.videosService.addThisVideo(body);
    } else {
      throw new UnauthorizedException('허가되지 않은 사용자입니다.');
    }
  }
}
