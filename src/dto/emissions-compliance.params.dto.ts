import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  propertyMetadata,
  ErrorMessages,
} from '@us-epa-camd/easey-common/constants';
import {
  IsYearFormat,
  IsInDateRange,
} from '@us-epa-camd/easey-common/pipes';

import { ComplianceParamsDTO } from './compliance.params.dto';
import { Page, PerPage } from '../utils/validator.const';

export class EmissionsComplianceParamsDTO extends ComplianceParamsDTO {
  @ApiProperty({
    isArray: true,
    description: propertyMetadata.year.description,
  })
  @IsOptional()
  @IsYearFormat({
    each: true,
    message: ErrorMessages.MultipleFormat('year', 'YYYY'),
  })
  @IsInDateRange(new Date('1996-01-01'), true, false, false, {
    each: true,
    message: ErrorMessages.DateRange(
      'year',
      true,
      'a year between 1996 and this year',
    ),
  })
  @Transform(({ value }) => value.split('|').map(item => item.trim()))
  year?: number[];
}

export class PaginatedEmissionsComplianceParamsDTO extends EmissionsComplianceParamsDTO {
  @ApiProperty({
    description: propertyMetadata.page.description,
  })
  @Page()
  page: number;

  @ApiProperty({
    description: propertyMetadata.perPage.description,
  })
  @PerPage()
  perPage: number;
}
