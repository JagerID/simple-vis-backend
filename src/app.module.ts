import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { VectorController } from './vector/vector.controller';
import { VectorService } from './vector/vector.service';
import { GeometryService } from './geometry/geometry.service';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [AppController, UserController, VectorController],
  providers: [
    AppService,
    PrismaService,
    UserService,
    VectorService,
    GeometryService,
  ],
})
export class AppModule {}
