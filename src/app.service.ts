import { Injectable, OnModuleInit } from '@nestjs/common';
import { config } from './config/app.config';

@Injectable()
export class AppService implements OnModuleInit {
  constructor() {}
  onModuleInit() {
    console.log(config.database);
  }
  getHello(): string {
    return 'Hello World!';
  }
}
