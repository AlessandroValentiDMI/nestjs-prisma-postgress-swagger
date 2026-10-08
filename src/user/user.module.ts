import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { LoggerService } from './user.logger.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { UsersRepository } from './users.repository.js';
import { MailService } from '../mail/mail.service.js';
import { MailModule } from '../mail/mail.module.js';
@Module({
  imports: [PrismaModule, MailModule],
  controllers: [UserController],
  providers: [UserService, LoggerService, UsersRepository, MailService],
  exports: [UsersRepository],
})
export class UserModule {}
