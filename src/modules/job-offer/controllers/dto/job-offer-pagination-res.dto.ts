import { ApiProperty } from '@nestjs/swagger';
import { JobOffer } from '../../domain/job-offer';
import { PaginationBase, PaginationResDto } from 'src/common/dto';

export class CompanyResponseDto {
  @ApiProperty({ example: 'Tech Innovations Inc.' })
  name: string;

  @ApiProperty({ example: 'Information Technology', nullable: true })
  industry?: string;

  @ApiProperty({ example: 'https://www.techinnovations.com', nullable: true })
  website?: string;
}

export class JobOfferPaginationRes {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'job-12345' })
  jobId: string;

  @ApiProperty({ example: 'Software Engineer' })
  title: string;

  @ApiProperty({ example: 'New York, NY' })
  location: string;

  @ApiProperty({ example: 60000 })
  salaryMin: number;

  @ApiProperty({ example: 120000 })
  salaryMax: number;

  @ApiProperty({ example: JobOffer.WorkTime[0], enum: JobOffer.WorkTime })
  workTime: JobOffer.WorkTime;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    type: String,
    format: 'date-time',
  })
  postedDate: Date;

  @ApiProperty({
    example: ['JavaScript', 'Node.js', 'React'],
    type: [String],
    nullable: true,
  })
  skills: string[];

  @ApiProperty({ example: true })
  isRemote: boolean;

  @ApiProperty({ type: () => CompanyResponseDto })
  company: CompanyResponseDto;
}

export class JobOfferPaginationResponseDto extends PaginationResDto<JobOfferPaginationRes> {
  @ApiProperty({ type: () => [JobOfferPaginationRes] })
  data: JobOfferPaginationRes[];

  constructor(data: JobOfferPaginationRes[], pagination: PaginationBase) {
    super(data, pagination);
  }
}
