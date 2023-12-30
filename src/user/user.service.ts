import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from 'utils/bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: CreateUserDto) {
    const { email, password } = user;
    const isExistUser = !!(await this.findByEmail(email));

    if (isExistUser) throw new ConflictException("Пользователь уже зарегистрирован")

    const passwordHash = await hashPassword(password);

    return this.prismaService.user.create({ data: { email, passwordHash } });
  }

  findOne(id: number) {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  delete(id: number) {
    return this.prismaService.user.delete({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prismaService.user.findUnique({ where: { email } });
  }
}
