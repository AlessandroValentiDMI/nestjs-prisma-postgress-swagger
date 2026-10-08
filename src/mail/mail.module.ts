import { Module } from '@nestjs/common';
import { MailService } from './mail.service.js';
import { UserModule } from '../user/user.module.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
@Module({
  imports: [PrismaModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
