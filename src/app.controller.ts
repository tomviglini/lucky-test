import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('auth')
  async createToken(@Body() payload): Promise<any> {
    // Improvemment: cleanup output error
    return {
      token: await this.appService.createToken(payload),
    };
  }
}
