import { Injectable, type OnModuleInit } from '@nestjs/common';
import type { User } from './user.js';
import { demoUsers } from './demo-users.js';
import { PasswordHasher } from '@nestjs/authentication';
import { UserService } from './user.service.js';
import { BadRequestException } from '@nestjs/common';
interface UserRow extends User {
  passwordHash: string | null;
}

/**
 * In-memory stand-in for your data layer (Prisma, Drizzle, TypeORM, ...).
 * Only `User` objects leave this class: password hashes stay inside.
 */
@Injectable()
export class UsersRepository {
  private readonly rows = new Map<string, UserRow>();

  constructor(
    private readonly passwordHasher: PasswordHasher,
    private readonly userService: UserService,
  ) {}

  async onModuleInit() {
    // Seeds the demo accounts, all with the password "catnip4all".
    const passwordHash = await this.passwordHasher.hash('catnip4all');
    for (const user of demoUsers) {
      this.rows.set(user.id, { ...user, passwordHash });
    }
  }
  async create(
    email: string,

    {
      passwordHash = null,
      emailVerified = false,
    }: { passwordHash?: string | null; emailVerified?: boolean } = {},
  ): Promise<User> {
    // const data: CreateUserDto = { email, passwordHash, emailVerified };
    if (passwordHash === null) {
      throw new BadRequestException('Email not usable');
    }
    const row: UserRow = await this.userService.createUser({
      email,
      passwordHash,
      emailVerified,
    });
    this.rows.set(row.id, row);
    return toUser(row);
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.userService.user({ id });
    return row ? toUser(row) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.userService.user({ email });
    return row ? toUser(row) : null;
  }

  /** For password sign-in only. */
  async findCredentials(
    email: string,
  ): Promise<{ user: User; passwordHash: string | null } | null> {
    const row = await this.userService.user({ email });
    return row ? { user: toUser(row), passwordHash: row.passwordHash } : null;
  }

  async updatePasswordHash(id: string, password: string): Promise<void> {
    const passwordHash = await this.passwordHasher.hash(password);
    await this.userService.updateUser({
      where: { id },
      data: { passwordHash },
    });
  }

  async updateEmail(id: string, email: string): Promise<User | null> {
    const row = await this.userService.updateUser({
      where: { id },
      data: { email, emailVerified: false }, // nobody has proven the new address yet
    });

    return toUser(row);
  }
}

// As the package passes addresses to handlers: an accent typed as two code points matches the stored one.
/*const normalize = (email: string) =>
  email.trim().normalize('NFC').toLowerCase();*/
const toUser = ({ id, email, emailVerified, roles }: UserRow): User => ({
  id,
  email,
  emailVerified,
  roles: [...roles],
});
