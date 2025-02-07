import { CompanyEntity } from 'src/infrastructure/database/entities/company.entity';
import { testDataSource } from './data-source';
import { seedDatabase } from './seed-db';

beforeAll(async () => {
  if (!testDataSource.isInitialized) {
    await testDataSource.initialize();
  }

  await testDataSource.synchronize(true);
  await seedDatabase(testDataSource, {
    company: [
      {
        name: 'Tech Solutions',
        industry: 'Software',
        website: 'https://techsolutions.com',
      },
    ],
  });
  const company = await testDataSource
    .getRepository(CompanyEntity)
    .findOneBy({});
  await seedDatabase(testDataSource, {
    job_offer: [
      {
        jobId: 'job-1',
        title: 'Backend developer',
        location: 'Canada',
        salaryMin: 300,
        salaryMax: 400,
        workTime: 'full-time',
        isRemote: false,
        company,
        skills: ['NestJS', 'PostgreSQL'],
        postedDate: new Date('2023-12-01T12:00:00Z'),
      },
    ],
  });
});

afterAll(async () => {
  if (testDataSource.isInitialized) {
    await testDataSource.destroy();
  }
});
