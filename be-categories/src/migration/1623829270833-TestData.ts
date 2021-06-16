import { isProduction } from 'src/utils/common.utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class TestData1623829270833 implements MigrationInterface {
  private testCategories: Array<{ id: string; name: string }> = [];

  constructor() {
    if (!isProduction()) {
      this.testCategories.push({
        id: 'fd9f7333-0f74-494d-943a-2bb18397ff9a',
        name: 'category one',
      });
      this.testCategories.push({
        id: 'a4bc7923-37f8-4b2e-80f6-9037e6f5a95b',
        name: 'category two',
      });
      this.testCategories.push({
        id: '78fdeca3-2afb-4571-90fa-d4f490195b84',
        name: 'category three',
      });
    }
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.testCategories.forEach((c) => {
      queryRunner.query(
        `INSERT INTO category (id, name) VALUES ('${c.id}', '${c.name}')`,
      );
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.testCategories.forEach((c) => {
      queryRunner.query(`DELETE FROM category WHERE id = '${c.id}'`);
    });
  }
}
