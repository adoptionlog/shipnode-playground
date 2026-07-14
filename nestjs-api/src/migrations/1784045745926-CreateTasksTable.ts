import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTasksTable1784045745926 implements MigrationInterface {
  name = 'CreateTasksTable1784045745926';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tasks',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'title', type: 'varchar' },
          { name: 'done', type: 'boolean', default: false },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tasks');
  }
}
