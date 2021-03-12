"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("../auth/auth.module");
const LikeReview_entity_1 = require("../entity/LikeReview.entity");
const Review_entity_1 = require("../entity/Review.entity");
const User_entity_1 = require("../entity/User.entity");
const Video_entity_1 = require("../entity/Video.entity");
const users_module_1 = require("../users/users.module");
const videos_module_1 = require("../videos/videos.module");
const reviews_controller_1 = require("./reviews.controller");
const reviews_service_1 = require("./reviews.service");
let ReviewsModule = class ReviewsModule {
};
ReviewsModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([Review_entity_1.Review, LikeReview_entity_1.LikeReview, User_entity_1.User, Video_entity_1.Video]),
            users_module_1.UsersModule,
            common_1.forwardRef(() => videos_module_1.VideosModule),
            auth_module_1.AuthModule,
        ],
        controllers: [reviews_controller_1.ReviewsController],
        providers: [reviews_service_1.ReviewsService],
        exports: [reviews_service_1.ReviewsService],
    })
], ReviewsModule);
exports.ReviewsModule = ReviewsModule;
//# sourceMappingURL=reviews.module.js.map