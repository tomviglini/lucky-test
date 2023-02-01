import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { decode, verify } from 'jsonwebtoken';
import { UserService } from './user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    // missing roles, app secret_key (I'm using the user password as secret_key to sign the jwt, I typically implement both (app secret_key and user password/salt))
    const request = context.switchToHttp().getRequest();
    const auth = request.headers?.authorization;
    if (!auth) {
      return false;
    }

    const token = auth.substring(7, auth.length);
    if (!token) {
      return false;
    }

    const payload: any = decode(token);
    const userId: number = payload?.data?.id;
    if (!userId) {
      return false;
    }

    const user = await this.userService.getUser(userId);
    if (!user) {
      return false;
    }

    try {
      await verify(token, user.password)
    } catch(e) {
      console.log(e);
      return false;
    }

    return true;
  }
}