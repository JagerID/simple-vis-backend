import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UserService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    create(user: CreateUserDto): Promise<{
        id: number;
        email: string;
        passwordHash: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: number;
        email: string;
        passwordHash: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        email: string;
        passwordHash: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    delete(id: number): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: number;
        email: string;
        passwordHash: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findByEmail(email: string): Promise<{
        id: number;
        email: string;
        passwordHash: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
