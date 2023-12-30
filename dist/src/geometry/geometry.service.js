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
exports.GeometryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let GeometryService = class GeometryService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async create(dto) {
        const { geom, id, name } = dto;
        return this.prismaService
            .$queryRaw `WITH data AS (SELECT '{ "type": "FeatureCollection",
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
};
exports.GeometryService = GeometryService;
exports.GeometryService = GeometryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GeometryService);
//# sourceMappingURL=geometry.service.js.map