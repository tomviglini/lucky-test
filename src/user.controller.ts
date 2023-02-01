import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from './auth.guard';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users/:id')
  @UseGuards(AuthGuard)
  GetUser(@Param('id') id): Promise<void> {
    return this.userService.getUserInfo(id);
  }

  @Post('users')
  async CreateUser(@Body() user): Promise<void> {
    return await this.userService.createUser(user);
  }
}
