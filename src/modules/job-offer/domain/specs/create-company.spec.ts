import { some, none } from 'fp-ts/Option';
import { CreateCompany } from '../create-company';

describe('Create Company Domain', () => {
  const validCompanyData = {
    name: 'Tech Corp',
    industry: 'Software',
    website: 'https://techcorp.com',
  };

  describe('mk', () => {
    it('should create a valid company', () => {
      const company = CreateCompany.mk(validCompanyData);
      expect(company).toBeDefined();
      expect(company.name).toBe(validCompanyData.name);
      expect(company.industry).toEqual(some(validCompanyData.industry));
      expect(company.website).toEqual(some(validCompanyData.website));
    });

    it('should throw error for empty name', () => {
      expect(() => CreateCompany.mk({ ...validCompanyData, name: '' })).toThrow(
        'Invalid Name',
      );
    });

    it('should allow undefined industry and website', () => {
      const company = CreateCompany.mk({ name: 'Tech Corp' });
      expect(company.industry).toEqual(none);
      expect(company.website).toEqual(none);
    });

    it('should throw error for invalid industry format', () => {
      expect(() =>
        CreateCompany.mk({ ...validCompanyData, industry: '' }),
      ).toThrow('Invalid Industry');
    });
  });
});
