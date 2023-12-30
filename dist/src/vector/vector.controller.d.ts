/// <reference types="multer" />
import { StreamableFile } from '@nestjs/common';
import { VectorService } from './vector.service';
export declare class VectorController {
    private readonly vectorService;
    constructor(vectorService: VectorService);
    create(dto: any): Promise<void>;
    findAll(): Promise<any>;
    getJsonFromFile(file: Express.Multer.File): StreamableFile;
}
