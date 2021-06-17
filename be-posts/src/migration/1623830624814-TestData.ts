import { isProduction } from '../utils/common.utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class TestData1623830624814 implements MigrationInterface {
  private testPosts: Array<{
    id: string;
    title: string;
    body: string;
    categoryId: string;
  }> = [];

  constructor() {
    if (!isProduction()) {
      this.testPosts.push({
        id: 'ec35743b-cd7e-45df-8108-fab854df4ded',
        title: 'post one',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas molestie lacus quam, sit amet volutpat eros eleifend nec. Cras a erat non mauris porta accumsan in quis nisi. Donec orci nisl, condimentum non fermentum ut, accumsan et dui. Vivamus viverra laoreet risus et viverra. Praesent fermentum pretium tristique. Nulla fringilla ultrices ipsum, a sollicitudin nisl. Suspendisse hendrerit dui sem, non auctor justo ullamcorper non. Suspendisse vel turpis mi. Vivamus nec urna justo. Donec in erat metus.',
        categoryId: 'fd9f7333-0f74-494d-943a-2bb18397ff9a',
      });
      this.testPosts.push({
        id: '66d6102e-11e8-4f8b-a88e-5e53518d3ee3',
        title: 'post two',
        body: 'Nullam pellentesque molestie convallis. Ut scelerisque libero at porta sagittis. Nulla ac tortor sed urna lobortis ullamcorper. Sed cursus arcu eget urna ultrices dictum. Mauris mattis quam nisi, sit amet elementum enim posuere eget. Morbi faucibus fermentum tristique. Donec elementum mauris vel sodales lobortis. Integer non dolor in ipsum volutpat dictum sit amet sit amet quam. Quisque ultricies magna nec nulla tempus porta. Morbi vehicula, felis consectetur consequat sagittis, velit dolor pellentesque quam, ac dapibus quam sapien vitae dui. Cras vitae sollicitudin lacus, a mattis turpis. Etiam nec nisl tincidunt nulla dapibus molestie eget eu leo. Ut eu ipsum a est malesuada mollis. Nulla consequat quam quis arcu faucibus, vel efficitur elit gravida.',
        categoryId: 'a4bc7923-37f8-4b2e-80f6-9037e6f5a95b',
      });
    }
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.testPosts.forEach((p) => {
      queryRunner.query(
        `INSERT INTO post (id, title, body, category_id) VALUES ('${p.id}', '${p.title}', '${p.body}', '${p.categoryId}')`,
      );
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.testPosts.forEach((p) => {
      queryRunner.query(`DELETE FROM post WHERE id = '${p.id}'`);
    });
  }
}
