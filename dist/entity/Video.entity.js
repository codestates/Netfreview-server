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
exports.Video = void 0;
const typeorm_1 = require("typeorm");
const Genre_entity_1 = require("./Genre.entity");
const Review_entity_1 = require("./Review.entity");
let Video = class Video {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('increment'),
    __metadata("design:type", Number)
], Video.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Video.prototype, "title", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Video.prototype, "description", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Video.prototype, "director", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Video.prototype, "actor", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Video.prototype, "ageLimit", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Video.prototype, "releaseYear", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Video.prototype, "posterUrl", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Video.prototype, "bannerUrl", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Video.prototype, "netflixUrl", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Video.prototype, "type", void 0);
__decorate([
    typeorm_1.OneToMany(() => Review_entity_1.Review, (review) => review.video, { cascade: true }),
    __metadata("design:type", Array)
], Video.prototype, "reviews", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Genre_entity_1.Genre, (genre) => genre.videos, { cascade: true }),
    __metadata("design:type", Array)
], Video.prototype, "genres", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", String)
], Video.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", String)
], Video.prototype, "updatedAt", void 0);
Video = __decorate([
    typeorm_1.Entity()
], Video);
exports.Video = Video;
//# sourceMappingURL=Video.entity.js.map