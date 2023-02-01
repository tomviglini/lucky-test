import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { compare } from 'bcrypt';

@Injectable()
export class AppService {
  constructor(private readonly dataSource: DataSource) {}

  async createToken(payload): Promise<any> {
    const user = await this.dataSource.query(
      `SELECT * FROM users WHERE users.username = "${payload.username}"`,
    );

    const passwordMatch = await compare(payload.password, user[0].password);

    if (!passwordMatch) {
      return Promise.resolve(false);
    }

    return true;
  }
}
