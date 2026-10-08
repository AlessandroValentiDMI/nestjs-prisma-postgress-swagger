import {
  Controller,
  Query,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  DefaultValuePipe,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { RoleGuard } from '../guards/role.guard.js';

import { User as UserModel } from '../generated/prisma/client.js';
import { MailService } from '../mail/mail.service.js';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('cursor') cursor?: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) take?: number,
  ): Promise<UserModel[]> {
    return this.userService.users({
      cursor,
      take,
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: { id: 'asc' },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserModel | null> {
    return this.userService.user({ id });
  }

  @Post()
  async create(@Body() userData: CreateUserDto): Promise<UserModel> {
    await this.mailService.sendMail();
    return await this.userService.createUser(userData);
  }
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() userData: UpdateUserDto,
  ): Promise<UserModel | null> {
    return this.userService.updateUser({ where: { id }, data: userData });
  }

  @Delete(':id/soft-delete')
  async softDelete(@Param('id') id: string): Promise<UserModel | null> {
    return this.userService.softDelete(id);
  }

  @Patch(':id/restore')
  async restore(@Param('id') id: string): Promise<UserModel | null> {
    return this.userService.restore(id);
  }

  @UseGuards(RoleGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<UserModel> {
    return this.userService.hardDelete(id);
  }
}
