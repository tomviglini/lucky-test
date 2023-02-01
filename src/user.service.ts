import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { genSalt, hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly dataSource: DataSource) {}

  async getUser(userId): Promise<any> {
    // This could be a lot better just using ORM/query builder
    const user = await this.dataSource.query(`
      SELECT 
        user.id,
        profile.name,
        address.street,
        city.name city,
        country.name country
      FROM
        user
      LEFT JOIN
        profile ON profile.user_id = user.id
      LEFT JOIN
        address ON address.id = profile.address_id
      LEFT JOIN
        city ON city.id = address.city_id
      LEFT JOIN
        country ON country.id = city.country_id
      WHERE
        user.id = ${userId}`);

      if (!user.length) {
        return Promise.resolve(false);
      }

      return Promise.resolve({
        id: user[0].id,
        name: user[0].name,
        address: {
          street: user[0].street,
          city: user[0].city,
          country: user[0].country
        }
      });
  }

  async createUser(user): Promise<void> {
    // Improvemment: Validations and cleanup output
    const password = await hash(user.password, 10);
    return await this.dataSource.query('INSERT INTO user (username, password) VALUES (?, ?)', [user.username, password]);
  }
}
