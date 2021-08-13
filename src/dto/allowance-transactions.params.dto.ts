import { Transform } from 'class-transformer';
import { IsDefined, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { PaginationDTO } from './pagination.dto';
import { State } from '../enum/state.enum';
import { AccountType } from '../enum/account-type.enum';
import { IsOrisCode } from '../pipes/is-oris-code.pipe';
import { IsStateCode } from '../pipes/is-state-code.pipe';
import { IsAccountType } from '../pipes/is-account-type.pipe';
import { IsAccountNumber } from '../pipes/is-account-number.pipe';
import { ErrorMessages } from '../utils/error-messages';
import { IsYearFormat } from '../pipes/is-year-format.pipe';
import { TransactionType } from '../enum/transaction-type.enum';
import { AllowanceProgram } from '../enum/allowance-programs.enum';

export class AllowanceTransactionsParamsDTO extends PaginationDTO {
  @IsOptional()
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  program?: AllowanceProgram[];

  @IsOptional()
  @IsAccountType({
    each: true,
    message: ErrorMessages.AccountCharacteristics(true, 'accountType'),
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  accountType?: AccountType[];

  @IsOptional()
  @IsAccountNumber({
    each: true,
    message: ErrorMessages.AccountCharacteristics(true, 'accountNumber'),
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  accountNumber?: string[];

  @IsOptional()
  @IsOrisCode({
    each: true,
    message: ErrorMessages.AccountCharacteristics(true, 'orisCode'),
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  orisCode?: number[];

  @IsOptional()
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  ownerOperator?: string[];

  @IsOptional()
  @IsStateCode({
    each: true,
    message: ErrorMessages.AccountCharacteristics(true, 'state'),
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  state?: State[];

  @IsOptional()
  @IsYearFormat({
    each: true,
    message: ErrorMessages.DateFormat('vintageYear', 'YYYY'),
  })
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  vintageYear?: number[];

  @IsDefined()
  transactionBeginDate: Date;

  @IsDefined()
  transactionEndDate: Date;

  @IsOptional()
  @Transform((value: string) => value.split('|').map(item => item.trim()))
  transactionType?: TransactionType[];

  @ApiProperty({
    description:
      'Attaches a file with data in the format specified by the Accept header',
  })
  attachFile?: boolean;
}