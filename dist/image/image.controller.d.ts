import { ImageService } from './image.service';
export declare class ImageController {
    private imageService;
    constructor(imageService: ImageService);
    upload(image: any): Promise<any>;
}
