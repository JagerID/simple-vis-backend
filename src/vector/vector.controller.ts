import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { VectorService } from './vector.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { createReadStream } from 'fs';
import { join } from 'path';

const defaultConfig = diskStorage({
  destination: './upload/files/',
  filename: (_, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

@Controller('vector')
export class VectorController {
  constructor(private readonly vectorService: VectorService) {}

  @Post()
  create(@Body() dto: any) {
    return this.vectorService.create(dto);
  }

  @Get()
  findAll() {
    return this.vectorService.findAll();
  }

  @Post('get-json')
  @UseInterceptors(FileInterceptor('file', { storage: defaultConfig }))
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="package.json"')
  getJsonFromFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    const f = createReadStream(
      join(process.cwd(), `upload/files/${file.originalname}`),
    );
    return new StreamableFile(f);
  }
}
