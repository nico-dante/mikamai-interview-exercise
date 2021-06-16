import { Injectable, Logger, Module, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class MieLogger extends Logger {}

@Module({
  providers: [MieLogger],
  exports: [MieLogger],
})
export class MieLoggerModule {}
