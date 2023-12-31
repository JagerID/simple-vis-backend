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
exports.VectorService = void 0;
const common_1 = require("@nestjs/common");
const geometry_service_1 = require("../geometry/geometry.service");
const prisma_service_1 = require("../prisma.service");
let VectorService = class VectorService {
    constructor(geometryService, prismaService) {
        this.geometryService = geometryService;
        this.prismaService = prismaService;
    }
    async create(dto) {
        const a = await this.geometryService.create(dto);
        console.log(a);
    }
    async findAll() {
        const vectors = (await this.prismaService
            .$queryRaw `SELECT ST_AsGeoJSON(geom)::json FROM vectors`).map((v) => v.st_asgeojson);
        return vectors;
    }
};
exports.VectorService = VectorService;
exports.VectorService = VectorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [geometry_service_1.GeometryService,
        prisma_service_1.PrismaService])
], VectorService);
//# sourceMappingURL=vector.service.js.map