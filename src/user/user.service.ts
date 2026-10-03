import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { LoggerService } from './user.logger.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma, User } from '../generated/prisma/client.js';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly Logger: LoggerService,
  ) {}

  async user(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    try {
      this.Logger.log('finding a user');
      return this.prisma.user.findUnique({ where });
    } catch {
      throw new NotFoundException('User not found');
    }
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: string;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take = 10, cursor, where, orderBy } = params;
    const cursorObj = cursor ? { id: cursor } : undefined;
    try {
      this.Logger.log('finding all users');
      return this.prisma.user.findMany({
        skip: cursorObj && skip === undefined ? 1 : skip,
        cursor: cursorObj,
        take,
        where: { ...where, deletedAt: null },
        orderBy: orderBy ?? { id: 'asc' },
      });
    } catch {
      throw new NotFoundException('User not found');
    }
  }

  async createUser(data: CreateUserDto): Promise<User> {
    this.Logger.log('Creating a new user');
    return this.prisma.user.create({ data });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: UpdateUserDto;
  }): Promise<User> {
    const { where, data } = params;
    try {
      this.Logger.log('updating a user');
      return this.prisma.user.update({ data, where });
    } catch {
      throw new NotFoundException('User not found');
    }
  }

  async softDelete(id: string): Promise<User> {
    try {
      this.Logger.log('soft deleting a user');
      return await this.prisma.user.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } catch {
      throw new NotFoundException('User not found');
    }
  }

  async restore(id: string): Promise<User> {
    try {
      this.Logger.log('restoring a user');
      return this.prisma.user.update({
        where: { id },
        data: { deletedAt: null },
      });
    } catch {
      throw new NotFoundException('User not found');
    }
  }

  async hardDelete(id: string): Promise<User> {
    try {
      this.Logger.log('hard deleting a user');
      return this.prisma.user.delete({ where: { id } });
    } catch {
      throw new NotFoundException('User not found');
    }
  }
}
