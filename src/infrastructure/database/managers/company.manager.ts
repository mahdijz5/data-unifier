import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CompanyEntity } from "../entities/company.entity";
import { Company } from "src/modules/job-offer/domain/company";
import { CompanyManagerInterface } from "./company.manager.interface";
import { isSome } from "fp-ts/Option";
 
export  class CompanyManager implements CompanyManagerInterface
{
    constructor(@InjectRepository(CompanyEntity) private readonly companyRepository:Repository<CompanyEntity>){}

    async create(data: Company): Promise<Company> {
        const entity =  this.companyRepository.create(this.toEntity(data))
        await this.companyRepository.save(entity);
        return this.toDomain(entity)
    }   

    
    private toEntity(data: Company): Partial<CompanyEntity> {
        return {
          name: data.name,
          industry: isSome(data.industry) ? data.industry.value : null, 
          website: isSome(data.website) ? data.website.value : null, 
        };
      }
    
      private toDomain(entity : Parameters<typeof Company.mk>[0]): Company {
        return Company.mk({
            industry :entity.industry,
            name : entity.name,
            website : entity.website
        })
    
      }
}
