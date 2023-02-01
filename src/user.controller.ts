import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users/:id')
  GetUser(@Param('id') id): Promise<void> {
    return this.userService.getUser(id);
  }

  @Post('users')
  async CreateUser(@Body() user): Promise<void> {
    return await this.userService.createUser(user);
  }
}
