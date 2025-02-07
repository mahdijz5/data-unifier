import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { RequestStatus } from '../enums';

export const ApiCustomOkResponse = (resultDto: any) => {
  return applyDecorators(
    ApiExtraModels(resultDto),
    ApiOkResponse({
      description: 'FindOne Response',
      schema: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: RequestStatus.SUCCESS,
          },
          statusCode: {
            type: 'number',
            example: HttpStatus.OK,
          },
          result: {
            type: 'object',
            $ref: getSchemaPath(resultDto),
          },
          timestamp: {
            type: 'Date',
            example: new Date(),
          },
        },
      },
    }),
  );
};
