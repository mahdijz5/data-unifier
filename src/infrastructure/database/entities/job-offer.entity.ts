import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { CompanyEntity } from './company.entity';

@Entity({ name: 'job_offer' })
export class JobOfferEntity extends AbstractEntity<JobOfferEntity> {
  @Column()
  jobId: string;

  @Column()
  title: string;

  @Column()
  location: string;

  @Column()
  salaryMin: number;

  @Column()
  salaryMax: number;

  @Column({
    type: 'timestamp with time zone',
  })
  postedDate: Date;

  @Column('simple-array', { nullable: true })
  skills: string[];

  @Column({ default: false })
  isRemote: boolean;

  @JoinColumn()
  @ManyToOne(() => CompanyEntity, (company) => company.jobOffers)
  company: CompanyEntity;
}
