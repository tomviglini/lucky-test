import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly dataSource: DataSource) {}

  async getUser(userId): Promise<any> {
    const user = await this.dataSource.query(`
      SELECT 
        *
      FROM
        user
      WHERE
        user.id = ${userId}`);

      if (!user.length) {
        return false;
      }

      return user[0];
  }

  async getUserInfo(userId): Promise<any> {
    // improv: exceptions/error messages
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
        return false;
      }

      return {
        id: user[0].id,
        name: user[0].name,
        address: {
          street: user[0].street,
          city: user[0].city,
          country: user[0].country
        }
      };
  }

  async createUser(user): Promise<any> {
    // Improvemment: Validations, better errors and cleanup output
    // dont like using this [0].id just using because can't use query builder/orm

    const password = await hash(user.password, 10);
    let userId;

    try {

      await this.dataSource.query('START TRANSACTION');

      await this.dataSource.query('INSERT INTO user (username, password) VALUES (?, ?)', [user.username, password]);
      userId = await this.dataSource.query('SELECT LAST_INSERT_ID() id');

      await this.dataSource.query('INSERT INTO address (city_id, street) VALUES (?, ?)', [user.address.city_id, user.address.street]);
      const addressId = await this.dataSource.query('SELECT LAST_INSERT_ID() id');

      await this.dataSource.query('INSERT INTO profile (user_id, address_id, name) VALUES (?, ?, ?)', [userId[0].id, addressId[0].id, user.name]);

      await this.dataSource.query('COMMIT');

    } catch(e) {
      console.log(e);
      await this.dataSource.query('ROLLBACK');
      return {
        msg: 'failed creating user'
      };
    }

    return this.getUser(userId[0].id);
  }
}
