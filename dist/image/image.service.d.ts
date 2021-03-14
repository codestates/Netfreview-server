import { S3 } from 'aws-sdk';
export declare class ImageService {
    uploadImage(image: any): Promise<string>;
    uploadS3(file: any, bucket: any, name: any): Promise<string>;
    getS3(): S3;
}
