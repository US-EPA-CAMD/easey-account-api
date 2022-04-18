import {
  Injectable,
  InternalServerErrorException,
  StreamableFile,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Transform } from 'stream';
import { plainToClass } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { PlainToCSV, PlainToJSON } from '@us-epa-camd/easey-common/transforms';
import { exclude } from '@us-epa-camd/easey-common/utilities';
import { ExcludeAllowanceTransactions } from '@us-epa-camd/easey-common/enums';

import {
  excludableColumnHeader,
  fieldMappingHeader,
  fieldMappings,
} from '../constants/field-mappings';
import { TransactionBlockDimRepository } from './transaction-block-dim.repository';
import { TransactionOwnerDimRepository } from './transaction-owner-dim.repository';
import { AllowanceTransactionsMap } from '../maps/allowance-transactions.map';
import { OwnerOperatorsMap } from '../maps/owner-operators.map';
import {
  PaginatedAllowanceTransactionsParamsDTO,
  StreamAllowanceTransactionsParamsDTO,
} from '../dto/allowance-transactions.params.dto';
import { AllowanceTransactionsDTO } from '../dto/allowance-transactions.dto';
import { OwnerOperatorsDTO } from '../dto/owner-operators.dto';
import { ApplicableAllowanceTransactionsAttributesDTO } from '../dto/applicable-allowance-transactions-attributes.dto';
import { ApplicableAllowanceTransactionsAttributesParamsDTO } from '../dto/applicable-allowance-transactions-attributes.params.dto';
import { TransactionBlockDim } from '../entities/transaction-block-dim.entity';
import { StreamService } from '@us-epa-camd/easey-common/stream';
import { ReadStream } from 'fs';

@Injectable()
export class AllowanceTransactionsService {
  constructor(
    @InjectRepository(TransactionBlockDimRepository)
    private readonly transactionBlockDimRepository: TransactionBlockDimRepository,
    private readonly allowanceTransactionsMap: AllowanceTransactionsMap,
    @InjectRepository(TransactionOwnerDimRepository)
    private readonly transactionOwnerDimRepository: TransactionOwnerDimRepository,
    private readonly ownerOperatorsMap: OwnerOperatorsMap,
    private readonly logger: Logger,
    private readonly streamService: StreamService,
  ) {}

  async getAllowanceTransactions(
    paginatedAllowanceTransactionsParamsDTO: PaginatedAllowanceTransactionsParamsDTO,
    req: Request,
  ): Promise<AllowanceTransactionsDTO[]> {
    this.logger.info('Getting allowance transactions');
    let entities: TransactionBlockDim[];
    try {
      entities = await this.transactionBlockDimRepository.getAllowanceTransactions(
        paginatedAllowanceTransactionsParamsDTO,
        req,
      );
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message);
    }

    req.res.setHeader(
      fieldMappingHeader,
      JSON.stringify(fieldMappings.allowances.transactions.data),
    );
    req.res.setHeader(
      excludableColumnHeader,
      JSON.stringify(fieldMappings.allowances.transactions.excludableColumns),
    );
    this.logger.info('Got allowance transactions');
    return this.allowanceTransactionsMap.many(entities);
  }

  async streamAllowanceTransactions(
    req: Request,
    params: StreamAllowanceTransactionsParamsDTO,
  ): Promise<StreamableFile> {
    const query = this.transactionBlockDimRepository.getStreamQuery(params);
    let stream: ReadStream = await this.streamService.getStream(query);

    req.on('close', () => {
      stream.emit('end');
    });

    req.res.setHeader(
      fieldMappingHeader,
      JSON.stringify(fieldMappings.allowances.transactions.data),
    );

    const toDto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        data = exclude(data, params, ExcludeAllowanceTransactions);
        delete data.transactionBlockId;
        const dto = plainToClass(AllowanceTransactionsDTO, data, {
          enableImplicitConversion: true,
        });
        const transactionDate = new Date(dto.transactionDate);
        dto.transactionDate = transactionDate.toISOString().split('T')[0];
        callback(null, dto);
      },
    });

    if (req.headers.accept === 'text/csv') {
      let fieldMappingValues = [];
      fieldMappingValues = fieldMappings.allowances.transactions.data;
      const fieldMappingsList = params.exclude
        ? fieldMappingValues.filter(
            item => !params.exclude.includes(item.value),
          )
        : fieldMappings.allowances.transactions.data;
      const toCSV = new PlainToCSV(fieldMappingsList);
      return new StreamableFile(stream.pipe(toDto).pipe(toCSV), {
        type: req.headers.accept,
        disposition: `attachment; filename="allowance-transactions-${uuid()}.csv"`,
      });
    }

    const objToString = new PlainToJSON();
    return new StreamableFile(stream.pipe(toDto).pipe(objToString), {
      type: req.headers.accept,
      disposition: `attachment; filename="allowance-transactions-${uuid()}.json"`,
    });
  }

  async getAllOwnerOperators(): Promise<OwnerOperatorsDTO[]> {
    const query = await this.transactionOwnerDimRepository.getAllOwnerOperators();
    return this.ownerOperatorsMap.many(query);
  }

  async getAllApplicableAllowanceTransactionsAttributes(
    applicableAllowanceTransactionsAttributesParamsDTO: ApplicableAllowanceTransactionsAttributesParamsDTO,
  ): Promise<ApplicableAllowanceTransactionsAttributesDTO[]> {
    let query;
    try {
      query = await this.transactionBlockDimRepository.getAllApplicableAllowanceTransactionsAttributes(
        applicableAllowanceTransactionsAttributesParamsDTO,
      );
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message);
    }

    return query.map(item => {
      const data = plainToClass(
        ApplicableAllowanceTransactionsAttributesDTO,
        item,
        {
          enableImplicitConversion: true,
        },
      );
      const transactionDate = new Date(data.transactionDate);
      data.transactionDate = transactionDate.toISOString().split('T')[0];
      return data;
    });
  }
}
