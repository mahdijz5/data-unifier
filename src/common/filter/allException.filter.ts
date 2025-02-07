import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ERROR, RequestStatus } from '../enums';
import { ZodError } from 'zod';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log('exception=---------');
    console.log(exception);
    const reply = host.switchToHttp().getResponse();

    let status = exception.status || HttpStatus.INTERNAL_SERVER_ERROR;
    let response = exception.response || ERROR.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      response = exception.getResponse();
    }

    if (exception instanceof ZodError) {
      status = 400;
      response = JSON.parse(exception.message);
    }

    reply.status(status).send({
      status: RequestStatus.FAILURE,
      statusCode: status,
      errors: response,
      timestamp: new Date().toString(),
    });
  }
}
