import { DataSource } from 'typeorm';
import { Task } from './tasks/entities/task.entity';

// typeorm-ts-node-commonjs requires exactly one exported DataSource in this
// file — a named + default export of the same instance makes its reflection
// see two candidates and refuse to pick one ("must contain only one export").
export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Task],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
