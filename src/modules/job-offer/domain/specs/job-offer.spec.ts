import { none, some } from 'fp-ts/Option';
import { JobOffer } from '../job-offer';

describe('JobOffer Domain', () => {
  const validData = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    jobId: 'job-123',
    title: 'Backend Developer',
    location: 'New York',
    salaryMin: 50000,
    salaryMax: 100000,
    postedDate: new Date(),
    isRemote: true,
    skills: ['Node.js', 'TypeScript'],
    workTime: JobOffer.WorkTime.Options[0],
    company: {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Tech Corp',
    },
  };

  describe('mk', () => {
    it('should create a valid job offer', () => {
      const job = JobOffer.mk(validData);
      expect(job).toBeDefined();
      expect(job.title).toBe('Backend Developer');
      expect(job.salaryMin).toBe(50000);
      expect(job.salaryMax).toBe(100000);
      expect(job.skills).toEqual(['Node.js', 'TypeScript']);
    });

    it('should throw error for invalid UUID', () => {
      expect(() => JobOffer.mk({ ...validData, id: 'invalid-uuid' })).toThrow(
        'Invalid UUID',
      );
    });

    it('should throw error if salaryMin > salaryMax', () => {
      expect(() =>
        JobOffer.mk({ ...validData, salaryMin: 120000, salaryMax: 100000 }),
      ).toThrow('Invalid salary range.');
    });

    it('should throw error for invalid work time', () => {
      expect(() => JobOffer.mk({ ...validData, workTime: 'invalid' })).toThrow(
        'Invalid WorkTime',
      );
    });
  });

  describe('Salary', () => {
    it('should create valid salary range', () => {
      const salary = JobOffer.Salary.mk(50000, 100000);
      expect(salary).toEqual(some([50000, 100000]));
    });

    it('should return none for invalid salary range', () => {
      const salary = JobOffer.Salary.mk(120000, 100000);
      expect(salary).toEqual(none);
    });

    it('should throw error for invalid salary range in mkUnsafe', () => {
      expect(() => JobOffer.Salary.mkUnsafe(120000, 100000)).toThrow();
    });
  });

  describe('WorkTime', () => {
    it('should create valid work time', () => {
      expect(JobOffer.WorkTime.mk('full-time')).toEqual(some('full-time'));
      expect(JobOffer.WorkTime.mk('part-time')).toEqual(some('part-time'));
    });

    it('should return none for invalid work time', () => {
      expect(JobOffer.WorkTime.mk('freelance')).toEqual(none);
    });

    it('should throw error for invalid work time in mkUnsafe', () => {
      expect(() => JobOffer.WorkTime.mkUnsafe('freelance')).toThrow();
    });
  });

  describe('SkillSet', () => {
    it('should create valid skill set', () => {
      expect(JobOffer.SkillSet.mk(['Node.js', 'TypeScript'])).toEqual(
        some(['Node.js', 'TypeScript']),
      );
    });

    it('should return none for invalid skill set (duplicates)', () => {
      expect(JobOffer.SkillSet.mk(['Node.js', 'Node.js'])).toEqual(none);
    });

    it('should throw error for invalid skill set in mkUnsafe', () => {
      expect(() =>
        JobOffer.SkillSet.mkUnsafe(['Node.js', 'Node.js']),
      ).toThrow();
    });
  });
});
