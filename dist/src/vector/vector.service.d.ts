import { GeometryService } from 'src/geometry/geometry.service';
import { PrismaService } from 'src/prisma.service';
import { Vector } from 'types/types';
export declare class VectorService {
    private readonly geometryService;
    private readonly prismaService;
    constructor(geometryService: GeometryService, prismaService: PrismaService);
    create(dto: Vector): Promise<void>;
    findAll(): Promise<any>;
}
