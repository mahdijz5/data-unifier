import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { CompanyManager } from '../company.manager';
import { CompanyEntity } from '../../entities/company.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateCompany } from 'src/modules/job-offer/domain/create-company';
import { Company } from 'src/modules/job-offer/domain/company';
import { some, none } from 'fp-ts/Option';

describe('CompanyManager', () => {
  let companyManager: CompanyManager;
  let companyRepositoryMock: jest.Mocked<Repository<CompanyEntity>>;

  beforeEach(async () => {
    companyRepositoryMock = {
      create: jest.fn(),
      save: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyManager,
        {
          provide: getRepositoryToken(CompanyEntity),
          useValue: companyRepositoryMock,
        },
      ],
    }).compile();

    companyManager = module.get<CompanyManager>(CompanyManager);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create and save a company correctly', async () => {
    const createCompanyData: CreateCompany = {
      name: 'Tech Corp',
      industry: some('IT'),
      website: some('https://techcorp.com'),
    } as any;

    const mockEntity = {
      id: 1,
      name: 'Tech Corp',
      industry: 'IT',
      website: 'https://techcorp.com',
    };

    companyRepositoryMock.create.mockReturnValue(mockEntity as any);
    companyRepositoryMock.save.mockResolvedValue(mockEntity as any);

    jest.spyOn(Company, 'mk').mockReturnValue({
      id: 1,
      name: 'Tech Corp',
      industry: 'IT',
      website: 'https://techcorp.com',
    } as any);

    const result = await companyManager.create(createCompanyData);

    expect(companyRepositoryMock.create).toHaveBeenCalledWith({
      name: 'Tech Corp',
      industry: 'IT',
      website: 'https://techcorp.com',
    });

    expect(companyRepositoryMock.save).toHaveBeenCalledWith(mockEntity);
    expect(result.name).toBe('Tech Corp');
    expect(result.industry).toBe('IT');
    expect(result.website).toBe('https://techcorp.com');
  });
});
