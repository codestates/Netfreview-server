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
exports.LikeReview = void 0;
const typeorm_1 = require("typeorm");
const Review_entity_1 = require("./Review.entity");
const User_entity_1 = require("./User.entity");
let LikeReview = class LikeReview {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('increment'),
    __metadata("design:type", Number)
], LikeReview.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Review_entity_1.Review, (review) => review.likeReview, {
        onDelete: 'CASCADE',
    }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", Review_entity_1.Review)
], LikeReview.prototype, "review", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_entity_1.User, (user) => user.likeReview, { onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", User_entity_1.User)
], LikeReview.prototype, "user", void 0);
LikeReview = __decorate([
    typeorm_1.Entity()
], LikeReview);
exports.LikeReview = LikeReview;
//# sourceMappingURL=LikeReview.entity.js.map