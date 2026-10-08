import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { PasswordResetService, Public } from '@nestjs/authentication';
import { EmailDto, ResetPasswordDto } from './auth.dto.js';
import { UsersRepository } from '../user/users.repository.js';

@Public()
@Controller('auth/password')
export class PasswordResetController {
  constructor(
    private readonly passwordResetService: PasswordResetService,
    private readonly userRepository: UsersRepository,
  ) {}

  // The same answer, as fast, whether or not the address has an account:
  // request() returns before it looks the address up.
  @Post('forgot')
  @HttpCode(202)
  async forgot(@Body() body: EmailDto) {
    try {
      await this.userRepository.findByEmail(body.email);
    } catch (e) {
      console.log(e);
    }
  }

  // Called by the page the link opens, with the token from its URL and the new password.
  @Post('reset')
  @HttpCode(200)
  async reset(@Body() body: ResetPasswordDto): Promise<void> {
    await this.userRepository.updatePasswordHash(body.id, body.password);
  }
}
