import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { JobOfferEntity } from './job-offer.entity';

@Entity({ name: 'company' })
export class CompanyEntity extends AbstractEntity<CompanyEntity> {
  @Column()
  name: string;

  @Column({ nullable: true })
  industry?: string;

  @Column({ nullable: true })
  website?: string;

  @OneToMany(() => JobOfferEntity, (jobOffer) => jobOffer.company)
  jobOffers: JobOfferEntity[];
}
