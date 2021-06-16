import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getProjectName(): string {
    return 'Mikamai Interview Exercise Services';
  }
}
