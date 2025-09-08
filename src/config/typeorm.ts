import 'dotenv/config';
import { DataSource } from 'typeorm';
import { URL } from 'url';

const dbUrl = new URL(process.env.DATABASE_URL!);
const isSSL = process.env.POSTGRES_SSL === 'true';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: dbUrl.hostname,
  port: Number(dbUrl.port),
  username: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.slice(1),
  synchronize: false,
  logging: true,
  ssl: isSSL ? { rejectUnauthorized: false } : false,
  entities: [`${__dirname}/**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/../db/migrations/*{.ts,.js}`],
});
