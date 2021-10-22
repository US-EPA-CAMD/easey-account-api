import { Injectable } from '@nestjs/common';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

import { BaseMap } from './base.map';
import { AllowanceHoldingDim } from '../entities/allowance-holding-dim.entity';
import { AllowanceHoldingsDTO } from '../dto/allowance-holdings.dto';

@Injectable()
export class AllowanceHoldingsMap extends BaseMap<
  AllowanceHoldingDim,
  AllowanceHoldingsDTO
> {
  public async one(entity: AllowanceHoldingDim): Promise<any> {
    return {
      [propertyMetadata.accountNumber.fieldLabels.value]: entity.accountNumber,
      [propertyMetadata.accountName.fieldLabels.value]: entity.accountName,
      [propertyMetadata.facilityId.fieldLabels.value]: entity.accountFact
        .facilityId
        ? Number(entity.accountFact.facilityId)
        : entity.accountFact.facilityId,
      [propertyMetadata.programCodeInfo.fieldLabels.value]:
        entity.programCodeInfo,
      [propertyMetadata.vintageYear.fieldLabels.value]: Number(
        entity.vintageYear,
      ),
      [propertyMetadata.totalBlock.fieldLabels.value]: entity.totalBlock
        ? Number(entity.totalBlock)
        : entity.totalBlock,
      [propertyMetadata.startBlock.fieldLabels.value]: Number(
        entity.startBlock,
      ),
      [propertyMetadata.endBlock.fieldLabels.value]: entity.endBlock
        ? Number(entity.endBlock)
        : entity.endBlock,
      [propertyMetadata.state.fieldLabels.value]: entity.accountFact.state,
      [propertyMetadata.epaRegion.fieldLabels.value]: entity.accountFact
        .epaRegion
        ? Number(entity.accountFact.epaRegion)
        : entity.accountFact.epaRegion,
      [propertyMetadata.ownerOperator.fieldLabels.value]:
        entity.accountFact.ownerOperator,
      [propertyMetadata.accountType.fieldLabels.value]:
        entity.accountFact.accountType,
    };
  }
}
