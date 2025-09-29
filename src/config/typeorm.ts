import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as path from 'path';
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
  logging: false, // Se recomienda desactivar el logging para la CLI para ver solo los mensajes importantes
  ssl: isSSL ? { rejectUnauthorized: false } : false,
  entities: [path.join(__dirname, '/../../**/*.entity{.ts,.js}')],
  migrations: [`${__dirname}/../db/migrations/*{.ts,.js}`],
});
