import { Injectable, OnModuleInit } from '@nestjs/common';
import { config } from './config/app.config';

@Injectable()
export class AppService {
  constructor() {}

  getHello(): string {
    return 'Hello World!';
  }
}
