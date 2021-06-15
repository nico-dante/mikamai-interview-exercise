import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MieLoggerModule } from './utils/logging.utils';

@Module({
  imports: [MieLoggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
