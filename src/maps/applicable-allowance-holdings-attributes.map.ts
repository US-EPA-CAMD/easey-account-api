import { Injectable } from '@nestjs/common';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { ApplicableAllowanceHoldingsAttributesDTO } from '../dto/applicable-allowance-holdings-attributes.dto';

import { BaseMap } from './base.map';

@Injectable()
export class ApplicableAllowanceHoldingsAttributesMap extends BaseMap<
  any,
  ApplicableAllowanceHoldingsAttributesDTO
> {
  public async one(entity: any): Promise<any> {
    return {
      [propertyMetadata.vintageYear.fieldLabels.value]: entity.vintageYear,
      [propertyMetadata.programCode.fieldLabels.value]:
        entity.programCodeInfo,
      [propertyMetadata.accountNumber.fieldLabels.value]:
        entity.accountFact.accountNumber,
      [propertyMetadata.accountType.fieldLabels.value]:
        entity.accountFact.accountType,
      [propertyMetadata.facilityId.fieldLabels.value]: entity.accountFact
        .facilityId
        ? Number(entity.accountFact.facilityId)
        : entity.accountFact.facilityId,
      [propertyMetadata.state.fieldLabels.value]: entity.accountFact.state,
      [propertyMetadata.ownerOperator.fieldLabels.value]:
        entity.accountFact.accountOwnerDim?.ownerOperator || null,
    };
  }
}
