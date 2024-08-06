import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AppService {
  async getHello() {
    return 'Hello World!';
  }
}
