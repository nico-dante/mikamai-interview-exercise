import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDatabase1623830598873 implements MigrationInterface {
  name = 'CreateDatabase1623830598873';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `post` (`id` varchar(36) NOT NULL, `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, `updated_at` datetime NULL, `deleted_at` datetime NULL, `active` tinyint NOT NULL DEFAULT 1, `title` varchar(255) NOT NULL, `body` text NOT NULL, `category_id` varchar(255) NOT NULL, UNIQUE INDEX `IDX_e28aa0c4114146bfb1567bfa9a` (`title`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `IDX_e28aa0c4114146bfb1567bfa9a` ON `post`',
    );
    await queryRunner.query('DROP TABLE `post`');
  }
}
