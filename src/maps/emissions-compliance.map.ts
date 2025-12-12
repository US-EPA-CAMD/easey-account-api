import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { UnitComplianceDim } from '../entities/unit-compliance-dim.entity';
import { EmissionsComplianceDTO } from '../dto/emissions-compliance.dto';

@Injectable()
export class EmissionsComplianceMap extends BaseMap<
  UnitComplianceDim,
  EmissionsComplianceDTO
> {
  public async one(entity: UnitComplianceDim): Promise<any> {
    const splitOwnWithPipe:string[] = entity.ownerDisplayFact?.owner?.split('|') ?? [];
    const splitOprWithPipe:string[] = entity.ownerDisplayFact?.operator?.split('|') ?? [];

    const uniqueOwn = [...new Set(splitOwnWithPipe.map(String))].join('|');
    const uniqueOpr = [...new Set(splitOprWithPipe.map(String))].join('|');

    const uniqueOwnOprList = [uniqueOwn, uniqueOpr];
    const ownerOperator = uniqueOwnOprList.filter(Boolean).join('|');

    return {
      year: entity.year,
      facilityName: entity.unitFact?.facilityName || null,
      facilityId: entity.unitFact?.facilityId,
      unitId: entity.unitFact?.unitId || null,
      ownerOperator: ownerOperator.length > 0 ? `${ownerOperator}` : null,
      stateCode: entity.unitFact?.stateCode || null,
      complianceApproach: entity.complianceApproach,
      avgPlanId: entity.avgPlanId,
      emissionsLimitDisplay: entity.emissionsLimitDisplay,
      actualEmissionsRate: entity.actualEmissionsRate,
      avgPlanActual: entity.avgPlanActual,
      inCompliance: entity.inCompliance,
    };
  }
}
