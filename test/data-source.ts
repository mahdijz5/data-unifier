import { CompanyEntity } from 'src/infrastructure/database/entities/company.entity';
import { JobOfferEntity } from 'src/infrastructure/database/entities/job-offer.entity';
import { DataSource } from 'typeorm';

export const testDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres_username',
  password: 'postgres_password',
  database: 'test_db',
  entities: [CompanyEntity, JobOfferEntity],
  synchronize: true,
  //   dropSchema: true,
});
