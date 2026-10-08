import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly prismaService: PrismaService,
  ) {}

  async sendMail() {
    const message = `New user created`;
    const toAdmin = await this.prismaService.user.findMany({
      where: { roles: { has: 'admin' } },
    });
    const to = toAdmin.map((user) => user.email);

    await this.mailerService.sendMail({
      to: to,
      subject: `New user created`,
      text: message,
    });
  }
}
