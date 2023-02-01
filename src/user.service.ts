import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { genSalt, hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly dataSource: DataSource) {}

  async getUser(userId): Promise<void> {
    return this.dataSource.query(`SELECT * FROM users WHERE users.id = ${userId}`);
  }

  async createUser(user): Promise<void> {
    const password = await hash(user.password, 10);
    return await this.dataSource.query('INSERT INTO users (username, password) VALUES (?, ?)', [user.username, password]);
  }
}
