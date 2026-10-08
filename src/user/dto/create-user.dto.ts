import { IsBoolean, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;
  passwordHash: string | null;
  @IsBoolean()
  emailVerified: boolean;
}
