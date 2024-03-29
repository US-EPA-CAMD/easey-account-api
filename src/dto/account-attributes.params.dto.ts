import { IsArray, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  propertyMetadata,
  ErrorMessages,
} from '@us-epa-camd/easey-common/constants';
import { AllowanceProgram } from '@us-epa-camd/easey-common/enums';

import { AllowanceParamsDTO } from './allowance.params.dto';
import { IsAllowanceProgram } from '../pipes/is-allowance-program.pipe';
import { Page, PerPage } from '../utils/validator.const';

export class AccountAttributesParamsDTO extends AllowanceParamsDTO {
  @ApiProperty({
    isArray: true,
    description: propertyMetadata.ownerOperatorInfo.description,
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => value.split('|').map(item => item.trim()))
  ownerOperator?: string[];

  @ApiProperty({
    enum: AllowanceProgram,
    description: propertyMetadata.programCodeInfo.description,
  })
  @IsOptional()
  @IsAllowanceProgram(false, {
    each: true,
    message:
      ErrorMessages.AccountCharacteristics(true, 'program-code') +
      '?allowanceUIFilter=true',
  })
  @Transform(({ value }) => value.split('|').map(item => item.trim()))
  programCodeInfo?: AllowanceProgram[];
}

export class PaginatedAccountAttributesParamsDTO extends AccountAttributesParamsDTO {
  @Page()
  @ApiProperty({
    description: propertyMetadata.page.description,
  })
  page: number;

  @PerPage()
  @ApiProperty({
    description: propertyMetadata.perPage.description,
  })
  perPage: number;
}
