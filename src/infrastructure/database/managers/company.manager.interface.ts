import { Company } from 'src/modules/job-offer/domain/company';
 
export interface CompanyManagerInterface  {
  create(data: Company): Promise<Company>;
}
