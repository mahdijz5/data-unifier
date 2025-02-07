import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AllExceptionFilter } from 'src/common/filter';

describe('Job Offer Pagination (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalFilters(new AllExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return paginated job offers', async () => {
    const response = await request(app.getHttpServer())
      .post('/job-offer/pagination')
      .send({
        filter: {
          title: 'Backend developer',
          location: 'Canada',
          isRemote: false,
          salaryMin: 200,
          salaryMax: 500,
          workTime: 'full-time',
        },
        page: 1,
        limit: 10,
      })
      .expect(200);
    expect(response.body).toMatchObject({
      pagination: {
        total: 1,
        page: 1,
        limit: 10,
      },
      data: expect.arrayContaining([
        expect.objectContaining({
          company: expect.objectContaining({
            name: 'Tech Solutions',
          }),
        }),
      ]),
    });
    expect(response.body.data).toHaveLength(1);
  });

  it('should return throw 400 error for invalid body', async () => {
    await request(app.getHttpServer())
      .post('/job-offer/pagination')
      .send({
        filter: {
          title: '',
        },
        page: 1,
        limit: 10,
      })
      .expect(400);
  });
});
