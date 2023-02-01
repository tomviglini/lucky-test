import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AppService {
  constructor(private readonly dataSource: DataSource) {}

  async createToken(payload): Promise<any> {
    const user = await this.dataSource.query(
      `SELECT * FROM user WHERE user.username = "${payload.username}"`,
    );

    if (!user.length) {
      return false;
    }

    const passwordMatch = await compare(payload.password, user[0].password);

    if (!passwordMatch) {
      return false;
    }

    const jwt = sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: {
          id: user[0].id,
          username: user[0].username,
        },
      },
      user[0].password,
    );

    return jwt;
  }
}
