"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const videos_service_1 = require("./videos.service");
const Video_entity_1 = require("../entity/Video.entity");
const videos_controller_1 = require("./videos.controller");
const reviews_module_1 = require("../reviews/reviews.module");
const users_module_1 = require("../users/users.module");
const Genre_entity_1 = require("../entity/Genre.entity");
const auth_module_1 = require("../auth/auth.module");
const Review_entity_1 = require("../entity/Review.entity");
let VideosModule = class VideosModule {
};
VideosModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([Video_entity_1.Video, Genre_entity_1.Genre, Review_entity_1.Review]),
            common_1.forwardRef(() => reviews_module_1.ReviewsModule),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
        ],
        controllers: [videos_controller_1.VideosController],
        providers: [videos_service_1.VideosService],
        exports: [videos_service_1.VideosService],
    })
], VideosModule);
exports.VideosModule = VideosModule;
//# sourceMappingURL=videos.module.js.map