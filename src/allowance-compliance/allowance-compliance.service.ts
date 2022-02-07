import {
  Injectable,
  InternalServerErrorException,
  StreamableFile,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { v4 as uuid } from 'uuid';
import { Transform } from 'stream';
import { plainToClass } from 'class-transformer';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { PlainToCSV, PlainToJSON } from '@us-epa-camd/easey-common/transforms';

import { fieldMappings } from '../constants/field-mappings';
import { AccountComplianceDimRepository } from './account-compliance-dim.repository';
import { OwnerYearDimRepository } from './owner-year-dim.repository';
import { AllowanceComplianceMap } from '../maps/allowance-compliance.map';
import { OwnerOperatorsMap } from '../maps/owner-operators.map';
import {
  AllowanceComplianceParamsDTO,
  PaginatedAllowanceComplianceParamsDTO,
} from '../dto/allowance-compliance.params.dto';
import { AllowanceComplianceDTO } from '../dto/allowance-compliance.dto';
import { OwnerOperatorsDTO } from '../dto/owner-operators.dto';
import { ApplicableAllowanceComplianceAttributesDTO } from '../dto/applicable-allowance-compliance-attributes.dto';
import { ApplicableAllowanceComplianceAttributesMap } from '../maps/applicable-allowance-compliance.map';
import { AccountComplianceDim } from '../entities/account-compliance-dim.entity';
import { includesOtcNbp } from '../utils/includes-otc-nbp.const';

@Injectable()
export class AllowanceComplianceService {
  constructor(
    @InjectRepository(AccountComplianceDimRepository)
    private readonly accountComplianceDimRepository: AccountComplianceDimRepository,
    private readonly allowanceComplianceMap: AllowanceComplianceMap,
    @InjectRepository(OwnerYearDimRepository)
    private readonly ownerYearDimRepository: OwnerYearDimRepository,
    private readonly ownerOperatorsMap: OwnerOperatorsMap,
    private readonly applicableAllowanceComplianceAttributesMap: ApplicableAllowanceComplianceAttributesMap,
    private Logger: Logger,
  ) {}

  async getAllowanceCompliance(
    paginatedAllowanceComplianceParamsDTO: PaginatedAllowanceComplianceParamsDTO,
    req: Request,
  ): Promise<AllowanceComplianceDTO[]> {
    this.Logger.info('Getting allowance compliance');
    let entities: AccountComplianceDim[];
    let fieldMapping;
    try {
      entities = await this.accountComplianceDimRepository.getAllowanceCompliance(
        req,
        paginatedAllowanceComplianceParamsDTO,
      );
    } catch (e) {
      this.Logger.error(InternalServerErrorException, e.message);
    }

    if (includesOtcNbp(paginatedAllowanceComplianceParamsDTO)) {
      fieldMapping = fieldMappings.compliance.allowanceNbpOtc;
    } else {
      fieldMapping = fieldMappings.compliance.allowance;
    }
    this.Logger.info('Setting header without program code info');
    req.res.setHeader('X-Field-Mappings', JSON.stringify(fieldMapping));

    this.Logger.info('Got allowance compliance');
    return this.allowanceComplianceMap.many(entities);
  }

  async streamAllowanceCompliance(
    allowanceComplianceParamsDTO: AllowanceComplianceParamsDTO,
    req: Request,
  ): Promise<StreamableFile> {
    const stream = await this.accountComplianceDimRepository.streamAllowanceCompliance(
      allowanceComplianceParamsDTO,
    );
    let fieldMapping;
    if (includesOtcNbp(allowanceComplianceParamsDTO)) {
      fieldMapping = fieldMappings.compliance.allowanceNbpOtc;
    } else {
      fieldMapping = fieldMappings.compliance.allowance;
    }
    req.res.setHeader('X-Field-Mappings', JSON.stringify(fieldMapping));
    const toDto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        if (!includesOtcNbp(allowanceComplianceParamsDTO)) {
          delete data.bankedHeld;
          delete data.currentHeld;
          delete data.totalRequiredDeductions;
          delete data.currentDeductions;
          delete data.deductOneToOne;
          delete data.deductTwoToOne;
        }
        const dto = plainToClass(AllowanceComplianceDTO, data, {
          enableImplicitConversion: true,
        });
        callback(null, dto);
      },
    });

    if (req.headers.accept === 'text/csv') {
      const toCSV = new PlainToCSV(fieldMapping);
      return new StreamableFile(stream.pipe(toDto).pipe(toCSV), {
        type: req.headers.accept,
        disposition: `attachment; filename="allowance-compliance-${uuid()}.csv"`,
      });
    }

    const objToString = new PlainToJSON();
    return new StreamableFile(stream.pipe(toDto).pipe(objToString), {
      type: req.headers.accept,
      disposition: `attachment; filename="allowance-compliance-${uuid()}.json"`,
    });
  }

  async getAllOwnerOperators(): Promise<OwnerOperatorsDTO[]> {
    const query = await this.ownerYearDimRepository.getAllOwnerOperators();
    return this.ownerOperatorsMap.many(query);
  }

  async getAllApplicableAllowanceComplianceAttributes(): Promise<
    ApplicableAllowanceComplianceAttributesDTO[]
  > {
    let query;
    try {
      query = await this.accountComplianceDimRepository.getAllApplicableAllowanceComplianceAttributes();
    } catch (e) {
      this.Logger.error(InternalServerErrorException, e.message);
    }

    return this.applicableAllowanceComplianceAttributesMap.many(query);
  }
}
