import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Config } from './index';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: Config.DB_HOST,
    port: Number(Config.DB_PORT),
    username: Config.DB_USERNAME,
    password: Config.DB_PASSWORD,
    database: Config.DB_NAME,
    //dont keep synchronize 'True' in production.
    synchronize: true,
    logging: false,
    entities: ['src/entity/*.{js,ts}'],
    migrations: ['src/migration/*.{js,ts}'],
    subscribers: [],
});
