import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { Authenticate } from '@nestjs/authentication';

@Authenticate({ optional: true })
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
