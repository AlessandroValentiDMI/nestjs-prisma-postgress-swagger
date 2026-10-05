import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { LoggerService } from './user.logger.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { UsersRepository } from './users.repository.js';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, LoggerService, UsersRepository],
  exports: [UsersRepository],
})
export class UserModule {}
