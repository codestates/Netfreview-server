"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageService = void 0;
const aws_sdk_1 = require("aws-sdk");
const common_1 = require("@nestjs/common");
let ImageService = class ImageService {
    async uploadImage(image) {
        if (!image) {
            throw new common_1.BadRequestException('이미지가 존재하지 않습니다.');
        }
        const { originalname } = image;
        const bucketS3 = process.env.AWS_S3_BUCKET_NAME;
        return await this.uploadS3(image.buffer, bucketS3, originalname);
    }
    async uploadS3(file, bucket, name) {
        const s3 = this.getS3();
        const params = {
            Bucket: bucket,
            Key: `image/${name}`,
            Body: file,
        };
        try {
            const stored = await s3.upload(params).promise();
            return stored.Location;
        }
        catch (err) {
            throw new common_1.BadRequestException();
        }
    }
    getS3() {
        return new aws_sdk_1.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
    }
};
ImageService = __decorate([
    common_1.Injectable()
], ImageService);
exports.ImageService = ImageService;
//# sourceMappingURL=image.service.js.map