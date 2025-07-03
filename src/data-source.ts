// 

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { envHelper } from './config/env.helper';
import { User } from './entities/user/user.entities';
import { Business } from './entities/business/business.entity';
import { Transaction } from './entities/transaction/transaction.entity';
import { Category } from './entities/business/category.entity';
import { BankDetails } from './entities/business/bank-details.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: envHelper.db.host,
  port: envHelper.db.port,
  username: envHelper.db.username,
  password: envHelper.db.password,
  database: envHelper.db.database,
  ssl: false,
  synchronize: true,
  logging: false,
  entities: [User, Business, Transaction, Category, BankDetails],
  subscribers: [],
  migrations: [],
});
