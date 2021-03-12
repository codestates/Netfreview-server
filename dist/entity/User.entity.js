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
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const Image_entity_1 = require("./Image.entity");
const LikeReview_entity_1 = require("./LikeReview.entity");
const RefreshToken_entity_1 = require("./RefreshToken.entity");
const Review_entity_1 = require("./Review.entity");
let User = class User {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    typeorm_1.Generated('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({ default: null }),
    __metadata("design:type", String)
], User.prototype, "profileUrl", void 0);
__decorate([
    typeorm_1.Column({ default: null }),
    __metadata("design:type", String)
], User.prototype, "introduction", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "nickname", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], User.prototype, "lastLogin", void 0);
__decorate([
    typeorm_1.OneToOne(() => Image_entity_1.Image, (image) => image.user),
    __metadata("design:type", Image_entity_1.Image)
], User.prototype, "image", void 0);
__decorate([
    typeorm_1.OneToMany(() => LikeReview_entity_1.LikeReview, (like) => like.user, { cascade: true }),
    __metadata("design:type", LikeReview_entity_1.LikeReview)
], User.prototype, "likeReview", void 0);
__decorate([
    typeorm_1.OneToOne(() => RefreshToken_entity_1.RefreshToken, (refreshToken) => refreshToken.user),
    __metadata("design:type", RefreshToken_entity_1.RefreshToken)
], User.prototype, "refreshToken", void 0);
__decorate([
    typeorm_1.OneToMany(() => Review_entity_1.Review, (review) => review.user),
    __metadata("design:type", Array)
], User.prototype, "reviews", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
User = __decorate([
    typeorm_1.Entity()
], User);
exports.User = User;
//# sourceMappingURL=User.entity.js.map