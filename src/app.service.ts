import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { compare } from 'bcrypt';
import { sign, decode, verify } from 'jsonwebtoken';

@Injectable()
export class AppService {
  constructor(private readonly dataSource: DataSource) {}

  async createToken(payload): Promise<any> {
    const user = await this.dataSource.query(
      `SELECT * FROM user WHERE user.username = "${payload.username}"`,
    );

    if (!user.length) {
      return Promise.resolve(false);
    }

    const passwordMatch = await compare(payload.password, user[0].password);

    if (!passwordMatch) {
      return Promise.resolve(false);
    }

    const jwt = sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: {
          id: user.id,
          username: user.username,
        },
      },
      user[0].password,
    );

    return jwt;
  }
}
