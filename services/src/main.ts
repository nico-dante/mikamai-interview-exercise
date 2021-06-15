import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { isProduction } from './utils/common.utils';
import { MieLogger } from './utils/logging.utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: !isProduction(),
  });

  app.useLogger(await app.resolve(MieLogger));

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();

  const config = new DocumentBuilder()
    .setTitle('Quotes Manager Backend')
    .setDescription('The Quotes Manager Backend API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(parseInt(process.env.PORT || '3000', 10));
}
bootstrap();
