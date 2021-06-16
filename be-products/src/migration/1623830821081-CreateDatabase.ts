import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDatabase1623830821081 implements MigrationInterface {
  name = 'CreateDatabase1623830821081';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `product` (`id` varchar(36) NOT NULL, `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, `updated_at` datetime NULL, `deleted_at` datetime NULL, `active` tinyint NOT NULL DEFAULT 1, `name` varchar(255) NOT NULL, `price` numeric(15, 2) NOT NULL, `category_id` varchar(255) NOT NULL, UNIQUE INDEX `IDX_22cc43e9a74d7498546e9a63e7` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `IDX_22cc43e9a74d7498546e9a63e7` ON `product`',
    );
    await queryRunner.query('DROP TABLE `product`');
  }
}
