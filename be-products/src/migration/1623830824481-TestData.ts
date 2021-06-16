import { isProduction } from 'src/utils/common.utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class TestData1623830824481 implements MigrationInterface {
  private testProducts: Array<{
    id: string;
    name: string;
    price: number;
    categoryId: string;
  }> = [];

  constructor() {
    if (!isProduction()) {
      this.testProducts.push({
        id: '9079b9dc-04da-4de3-b491-6b275b55d341',
        name: 'product one',
        price: 3.5,
        categoryId: 'fd9f7333-0f74-494d-943a-2bb18397ff9a',
      });
    }
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.testProducts.forEach((p) => {
      queryRunner.query(
        `INSERT INTO product (id, name, price, category_id) VALUES ('${p.id}', '${p.name}', ${p.price}, '${p.categoryId}')`,
      );
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.testProducts.forEach((p) => {
      queryRunner.query(`DELETE FROM product WHERE id = '${p.id}'`);
    });
  }
}
