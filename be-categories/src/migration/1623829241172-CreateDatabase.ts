import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDatabase1623829241172 implements MigrationInterface {
  name = 'CreateDatabase1623829241172';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `category` (`id` varchar(36) NOT NULL, `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, `updated_at` datetime NULL, `deleted_at` datetime NULL, `active` tinyint NOT NULL DEFAULT 1, `name` varchar(255) NOT NULL, UNIQUE INDEX `IDX_23c05c292c439d77b0de816b50` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `IDX_23c05c292c439d77b0de816b50` ON `category`',
    );
    await queryRunner.query('DROP TABLE `category`');
  }
}
