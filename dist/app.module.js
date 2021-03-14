"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const videos_module_1 = require("./videos/videos.module");
const users_module_1 = require("./users/users.module");
const reviews_module_1 = require("./reviews/reviews.module");
const typeorm_1 = require("@nestjs/typeorm");
const Review_entity_1 = require("./entity/Review.entity");
const User_entity_1 = require("./entity/User.entity");
const Video_entity_1 = require("./entity/Video.entity");
const Image_entity_1 = require("./entity/Image.entity");
const Genre_entity_1 = require("./entity/Genre.entity");
const LikeReview_entity_1 = require("./entity/LikeReview.entity");
const config_1 = require("@nestjs/config");
const RefreshToken_entity_1 = require("./entity/RefreshToken.entity");
const image_module_1 = require("./image/image.module");
const mailer_1 = require("@nestjs-modules/mailer");
const mail_service_1 = require("./mail/mail.service");
const auth_module_1 = require("./auth/auth.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            config_1.ConfigModule.forRoot(),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.DATABASE_HOST,
                port: 3306,
                username: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE,
                autoLoadEntities: true,
                entities: [Review_entity_1.Review, User_entity_1.User, Video_entity_1.Video, Image_entity_1.Image, Genre_entity_1.Genre, LikeReview_entity_1.LikeReview, RefreshToken_entity_1.RefreshToken],
                synchronize: true,
            }),
            mailer_1.MailerModule.forRoot({
                transport: {
                    host: 'smtp.gmail.com',
                    secure: false,
                    auth: {
                        user: process.env.NODEMAILER_USER,
                        pass: process.env.NODEMAILER_PASSWORD,
                    },
                },
                defaults: {
                    from: process.env.NODEMAILER_USER,
                },
            }),
            videos_module_1.VideosModule,
            users_module_1.UsersModule,
            reviews_module_1.ReviewsModule,
            config_1.ConfigModule,
            image_module_1.ImageModule,
            auth_module_1.AuthModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, mail_service_1.MailService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map