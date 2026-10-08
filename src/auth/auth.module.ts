import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module.js';
import { AuthController } from './auth.controller.js';
import { CredentialsService } from './credentials.service.js';
import { TokensController } from './tokens.controller.js';
import { JwtAuth } from './jwt-auth.provider.js';
import { PasswordResetController } from './password-reset.controller.js';

@Module({
  imports: [UserModule],
  controllers: [AuthController, TokensController, PasswordResetController],
  providers: [JwtAuth, CredentialsService],
})
export class AuthModule {}
