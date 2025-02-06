import { Company } from 'src/modules/job-offer/domain/company';
import { CreateCompany } from 'src/modules/job-offer/domain/create-company';

export interface CompanyManagerInterface {
  create(data: CreateCompany): Promise<Company>;
}
