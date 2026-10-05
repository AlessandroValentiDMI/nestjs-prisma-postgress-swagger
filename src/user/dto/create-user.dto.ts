import { IsBoolean, IsEmail, IsString, MinLength } from 'class-validator';
import { isNil } from '@nestjs/common/internal';

export class CreateUserDto {
  @IsEmail()
  email: string;
  passwordHash: string | null;
  @IsBoolean()
  emailVerified: boolean;
}
