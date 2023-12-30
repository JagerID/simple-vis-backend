import { Injectable } from '@nestjs/common';
import { GeometryService } from 'src/geometry/geometry.service';
import { PrismaService } from 'src/prisma.service';
import { Vector } from 'types/types';

@Injectable()
export class VectorService {
  constructor(
    private readonly geometryService: GeometryService,
    private readonly prismaService: PrismaService,
  ) {}

  async create(dto: Vector) {
    const a = await this.geometryService.create(dto);
    console.log(a);
  }

  async findAll() {
    const vectors = (
      (await this.prismaService
        .$queryRaw`SELECT ST_AsGeoJSON(geom)::json FROM vectors`) as any
    ).map((v) => v.st_asgeojson);
    return vectors;
  }
}
