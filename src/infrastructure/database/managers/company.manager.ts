import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from '../entities/company.entity';
import { Company } from 'src/modules/job-offer/domain/company';
import { CompanyManagerInterface } from './company.manager.interface';
import { isSome } from 'fp-ts/Option';
import { Injectable } from '@nestjs/common';
import { CreateCompany } from 'src/modules/job-offer/domain/create-company';

@Injectable()
export class CompanyManager implements CompanyManagerInterface {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
  ) {}

  async create(data: CreateCompany): Promise<Company> {
    const entity = this.companyRepository.create({
      name: data.name,
      industry: isSome(data.industry) ? data.industry.value : null,
      website: isSome(data.website) ? data.website.value : null,
    });
    await this.companyRepository.save(entity);
    return Company.mk(entity);
  }
}
