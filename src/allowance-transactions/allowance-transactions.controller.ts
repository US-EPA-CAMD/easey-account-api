import { Request } from 'express';
import { Get, Controller, Query, Req, UseInterceptors, StreamableFile } from '@nestjs/common';
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
  AllowanceTransactionsParamsDTO,
  PaginatedAllowanceTransactionsParamsDTO,
} from '../dto/allowance-transactions.params.dto';
import { OwnerOperatorsDTO } from '../dto/owner-operators.dto';
import { ApplicableAllowanceTransactionsAttributesDTO } from '../dto/applicable-allowance-transactions-attributes.dto';
import { ApplicableAllowanceTransactionsAttributesParamsDTO } from '../dto/applicable-allowance-transactions-attributes.params.dto';
import {
  BadRequestResponse,
  NotFoundResponse,
  ApiQueryMultiSelect,
} from '../utils/swagger-decorator.const';

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
    description: 'Retrieve Allowance Transactions per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(AllowanceTransactionsDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
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
    @Query() paginatedAllowanceTransactionsParamsDTO: PaginatedAllowanceTransactionsParamsDTO,
    @Req() req: Request,
  ): Promise<AllowanceTransactionsDTO[]> {
    return this.allowanceTransactionsService.getAllowanceTransactions(
      paginatedAllowanceTransactionsParamsDTO,
      req,
    );
  }

  @Get('stream')
  @ApiOkResponse({
    description: 'Retrieve Allowance Transactions per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(AllowanceTransactionsDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
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
  streamAllowanceTransactions(
    @Query() allowanceTransactionsParamsDTO: AllowanceTransactionsParamsDTO,
    @Req() req: Request,
  ): Promise<StreamableFile> {
    return this.allowanceTransactionsService.streamAllowanceTransactions(
      allowanceTransactionsParamsDTO,
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
