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
exports.Review = void 0;
const typeorm_1 = require("typeorm");
const LikeReview_entity_1 = require("./LikeReview.entity");
const User_entity_1 = require("./User.entity");
const Video_entity_1 = require("./Video.entity");
let Review = class Review {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('increment'),
    __metadata("design:type", Number)
], Review.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Review.prototype, "rating", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Review.prototype, "text", void 0);
__decorate([
    typeorm_1.OneToMany(() => LikeReview_entity_1.LikeReview, (like) => like.review, { cascade: true }),
    __metadata("design:type", LikeReview_entity_1.LikeReview)
], Review.prototype, "likeReview", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_entity_1.User, (user) => user.reviews),
    __metadata("design:type", User_entity_1.User)
], Review.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Video_entity_1.Video, (video) => video.reviews, { onDelete: 'CASCADE' }),
    __metadata("design:type", Video_entity_1.Video)
], Review.prototype, "video", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Review.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Review.prototype, "updatedAt", void 0);
Review = __decorate([
    typeorm_1.Entity()
], Review);
exports.Review = Review;
//# sourceMappingURL=Review.entity.js.map