import { PrismaService } from 'src/prisma.service';
import { Vector } from 'types/types';
export declare class GeometryService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    create(dto: Vector): Promise<unknown>;
}
