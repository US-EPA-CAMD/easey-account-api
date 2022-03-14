import { Request } from 'express';
import {
  Get,
  Controller,
  Query,
  Req,
  UseInterceptors,
  StreamableFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  getSchemaPath,
  ApiExtraModels,
  ApiQuery,
  ApiSecurity,
} from '@nestjs/swagger';
import { Json2CsvInterceptor } from '@us-epa-camd/easey-common/interceptors';

import { AllowanceTransactionsService } from './allowance-transactions.service';
import { AllowanceTransactionsDTO } from '../dto/allowance-transactions.dto';
import {
  PaginatedAllowanceTransactionsParamsDTO,
  StreamAllowanceTransactionsParamsDTO,
} from '../dto/allowance-transactions.params.dto';
import { OwnerOperatorsDTO } from '../dto/owner-operators.dto';
import { ApplicableAllowanceTransactionsAttributesDTO } from '../dto/applicable-allowance-transactions-attributes.dto';
import { ApplicableAllowanceTransactionsAttributesParamsDTO } from '../dto/applicable-allowance-transactions-attributes.params.dto';
import {
  BadRequestResponse,
  NotFoundResponse,
  ApiQueryMultiSelect,
  ExcludeQuery,
} from '../utils/swagger-decorator.const';
import { fieldMappings } from '../constants/field-mappings';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Allowance Transactions')
@ApiExtraModels(AllowanceTransactionsDTO)
export class AllowanceTransactionsController {
  constructor(
    private readonly allowanceTransactionsService: AllowanceTransactionsService,
  ) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves Allowance Transactions per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(AllowanceTransactionsDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.allowances.transactions
            .map(i => i.label)
            .join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryMultiSelect()
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'transactionType',
    required: false,
    explode: false,
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'vintageYear',
    required: false,
    explode: false,
  })
  @UseInterceptors(Json2CsvInterceptor)
  getAllowanceTransactions(
    @Query()
    paginatedAllowanceTransactionsParamsDTO: PaginatedAllowanceTransactionsParamsDTO,
    @Req() req: Request,
  ): Promise<AllowanceTransactionsDTO[]> {
    return this.allowanceTransactionsService.getAllowanceTransactions(
      paginatedAllowanceTransactionsParamsDTO,
      req,
    );
  }

  @Get('stream')
  @ApiOkResponse({
    description: 'Streams Allowance Transactions per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(AllowanceTransactionsDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.allowances.transactions
            .map(i => i.label)
            .join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryMultiSelect()
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'transactionType',
    required: false,
    explode: false,
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'vintageYear',
    required: false,
    explode: false,
  })
  @ExcludeQuery()
  streamAllowanceTransactions(
    @Query() params: StreamAllowanceTransactionsParamsDTO,
    @Req() req: Request,
  ): Promise<StreamableFile> {
    return this.allowanceTransactionsService.streamAllowanceTransactions(
      params,
      req,
    );
  }

  @Get('attributes/applicable')
  @ApiExtraModels(ApplicableAllowanceTransactionsAttributesDTO)
  @ApiOkResponse({
    description: 'Retrieved All Applicable Allowance Transactions Attributes',
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiExtraModels(ApplicableAllowanceTransactionsAttributesDTO)
  getAllApplicableAllowanceTransactionsAttributes(
    @Query()
    applicableAllowanceTransactionsAttributesParamsDTO: ApplicableAllowanceTransactionsAttributesParamsDTO,
  ): Promise<ApplicableAllowanceTransactionsAttributesDTO[]> {
    return this.allowanceTransactionsService.getAllApplicableAllowanceTransactionsAttributes(
      applicableAllowanceTransactionsAttributesParamsDTO,
    );
  }

  @Get('owner-operators')
  @ApiOkResponse({
    description: 'Retrieved All Valid Owner Operators',
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiExtraModels(OwnerOperatorsDTO)
  getAllOwnerOperators(): Promise<OwnerOperatorsDTO[]> {
    return this.allowanceTransactionsService.getAllOwnerOperators();
  }
}
