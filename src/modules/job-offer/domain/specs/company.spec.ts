import { some, none } from 'fp-ts/Option';
import { Company } from '../company';

describe('Company Domain', () => {
  const validCompanyData = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Tech Corp',
    industry: 'Software',
    website: 'https://techcorp.com',
  };

  describe('mk', () => {
    it('should create a valid company', () => {
      const company = Company.mk(validCompanyData);
      expect(company).toBeDefined();
      expect(company.id).toBe(validCompanyData.id);
      expect(company.name).toBe(validCompanyData.name);
      expect(company.industry).toEqual(some(validCompanyData.industry));
      expect(company.website).toEqual(some(validCompanyData.website));
    });

    it('should throw error for invalid UUID', () => {
      expect(() =>
        Company.mk({ ...validCompanyData, id: 'invalid-uuid' }),
      ).toThrow('Invalid UUID');
    });

    it('should throw error for empty name', () => {
      expect(() => Company.mk({ ...validCompanyData, name: '' })).toThrow(
        'Invalid Name',
      );
    });

    it('should allow undefined industry and website', () => {
      const company = Company.mk({
        id: validCompanyData.id,
        name: 'Tech Corp',
      });
      expect(company.industry).toEqual(none);
      expect(company.website).toEqual(none);
    });

    it('should throw error for invalid industry format', () => {
      expect(() => Company.mk({ ...validCompanyData, industry: '' })).toThrow(
        'Invalid Industry',
      );
    });
  });
});
