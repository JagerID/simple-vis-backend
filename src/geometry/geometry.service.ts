import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Vector } from 'types/types';

@Injectable()
export class GeometryService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: Vector) {
    const { geom, id, name } = dto;
    return this.prismaService
      .$queryRaw`WITH data AS (SELECT '{ "type": "FeatureCollection",
      "features": [
        { "type": "Feature",
          "geometry": {"type": "Point", "coordinates": [102.0, 0.5]},
          "properties": {"prop0": "value0"}
          },
        { "type": "Feature",
          "geometry": {
            "type": "LineString",
            "coordinates": [
              [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
              ]
            },
          "properties": {
            "prop0": "value0",
            "prop1": 0.0
            }
          },
        { "type": "Feature",
           "geometry": {
             "type": "Polygon",
             "coordinates": [
               [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
                 [100.0, 1.0], [100.0, 0.0] ]
               ]
           },
           "properties": {
             "prop0": "value0",
             "prop1": {"this": "that"}
             }
           }
         ]
       }'::json AS fc)
  `;
  }
}
