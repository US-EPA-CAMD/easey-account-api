import {propertyMetadata} from '@us-epa-camd/easey-constants';

const holdings = [
  { ...propertyMetadata.accountNumber.fieldLabels },
  { ...propertyMetadata.accountName.fieldLabels },
  { ...propertyMetadata.facilityId.fieldLabels },
  { ...propertyMetadata.programCodeInfo.fieldLabels },
  { ...propertyMetadata.vintageYear.fieldLabels },
  { ...propertyMetadata.totalBlock.fieldLabels },
  { ...propertyMetadata.startBlock.fieldLabels },
  { ...propertyMetadata.endBlock.fieldLabels },
  { ...propertyMetadata.state.fieldLabels },
  { ...propertyMetadata.epaRegion.fieldLabels },
  { ...propertyMetadata.ownerOperatorInfo.fieldLabels },
  { ...propertyMetadata.accountType.fieldLabels },
];

const transactions = [
  { ...propertyMetadata.programCodeInfo.fieldLabels },
  { ...propertyMetadata.transactionId.fieldLabels },
  { ...propertyMetadata.transactionTotal.fieldLabels },
  { ...propertyMetadata.transactionType.fieldLabels },
  { ...propertyMetadata.sellAccountNumber.fieldLabels },
  { ...propertyMetadata.sellAccountName.fieldLabels },
  { ...propertyMetadata.sellAccountType.fieldLabels },
  { ...propertyMetadata.sellFacilityName.fieldLabels },
  { ...propertyMetadata.sellFacilityId.fieldLabels },
  { ...propertyMetadata.sellState.fieldLabels },
  { ...propertyMetadata.sellEpaRegion.fieldLabels },
  { ...propertyMetadata.sellSourceCategory.fieldLabels },
  { ...propertyMetadata.sellOwner.fieldLabels },
  { ...propertyMetadata.buyAccountNumber.fieldLabels },
  { ...propertyMetadata.buyAccountName.fieldLabels },
  { ...propertyMetadata.buyAccountType.fieldLabels },
  { ...propertyMetadata.buyFacilityName.fieldLabels },
  { ...propertyMetadata.buyFacilityId.fieldLabels },
  { ...propertyMetadata.buyState.fieldLabels },
  { ...propertyMetadata.buyEpaRegion.fieldLabels },
  { ...propertyMetadata.buySourceCategory.fieldLabels },
  { ...propertyMetadata.buyOwner.fieldLabels },
  { ...propertyMetadata.transactionDate.fieldLabels },
  { ...propertyMetadata.vintageYear.fieldLabels },
  { ...propertyMetadata.startBlock.fieldLabels },
  { ...propertyMetadata.endBlock.fieldLabels },
  { ...propertyMetadata.totalBlock.fieldLabels },
];

const accountAttributes = [
  { ...propertyMetadata.accountNumber.fieldLabels },
  { ...propertyMetadata.accountName.fieldLabels },
  { ...propertyMetadata.programCodeInfo.fieldLabels },
  { ...propertyMetadata.accountType.fieldLabels },
  { ...propertyMetadata.facilityId.fieldLabels },
  { ...propertyMetadata.unitId.fieldLabels },
  { ...propertyMetadata.ownerOperatorInfo.fieldLabels },
  { ...propertyMetadata.state.fieldLabels },
  { ...propertyMetadata.epaRegion.fieldLabels },
  { ...propertyMetadata.nercRegion.fieldLabels },
];

const allowanceComplianceNbpOtc = [
  { ...propertyMetadata.programCodeInfo.fieldLabels },
  { ...propertyMetadata.year.fieldLabels },
  { ...propertyMetadata.accountNumber.fieldLabels },
  { ...propertyMetadata.accountName.fieldLabels },
  { ...propertyMetadata.facilityName.fieldLabels },
  { ...propertyMetadata.facilityId.fieldLabels },
  { ...propertyMetadata.unitsAffected.fieldLabels },
  { ...propertyMetadata.allocated.fieldLabels },
  { ...propertyMetadata.bankedHeld.fieldLabels },
  { ...propertyMetadata.currentHeld.fieldLabels },
  { ...propertyMetadata.totalAllowancesHeld.fieldLabels },
  { ...propertyMetadata.complianceYearEmissions.fieldLabels },
  { ...propertyMetadata.otherDeductions.fieldLabels },
  { ...propertyMetadata.totalRequiredDeductions.fieldLabels },
  { ...propertyMetadata.currentDeductions.fieldLabels },
  { ...propertyMetadata.deductOneToOne.fieldLabels },
  { ...propertyMetadata.deductTwoToOne.fieldLabels },
  { ...propertyMetadata.totalAllowancesDeducted.fieldLabels },
  { ...propertyMetadata.carriedOver.fieldLabels },
  { ...propertyMetadata.excessEmissions.fieldLabels },
  { ...propertyMetadata.ownerOperatorInfo.fieldLabels },
  { ...propertyMetadata.state.fieldLabels },
];

const allowanceCompliance = [
  { ...propertyMetadata.programCodeInfo.fieldLabels },
  { ...propertyMetadata.year.fieldLabels },
  { ...propertyMetadata.accountNumber.fieldLabels },
  { ...propertyMetadata.accountName.fieldLabels },
  { ...propertyMetadata.facilityName.fieldLabels },
  { ...propertyMetadata.facilityId.fieldLabels },
  { ...propertyMetadata.unitsAffected.fieldLabels },
  { ...propertyMetadata.allocated.fieldLabels },
  { ...propertyMetadata.totalAllowancesHeld.fieldLabels },
  { ...propertyMetadata.complianceYearEmissions.fieldLabels },
  { ...propertyMetadata.otherDeductions.fieldLabels },
  { ...propertyMetadata.totalAllowancesDeducted.fieldLabels },
  { ...propertyMetadata.carriedOver.fieldLabels },
  { ...propertyMetadata.excessEmissions.fieldLabels },
  { ...propertyMetadata.ownerOperatorInfo.fieldLabels },
  { ...propertyMetadata.state.fieldLabels },
];

const emissionsCompliance = [
  { ...propertyMetadata.year.fieldLabels },
  { ...propertyMetadata.facilityName.fieldLabels },
  { ...propertyMetadata.facilityId.fieldLabels },
  { ...propertyMetadata.unitId.fieldLabels },
  { ...propertyMetadata.ownerOperatorInfo.fieldLabels },
  { ...propertyMetadata.state.fieldLabels },
  { ...propertyMetadata.complianceApproach.fieldLabels },
  { ...propertyMetadata.avgPlanId.fieldLabels },
  { ...propertyMetadata.emissionsLimitDisplay.fieldLabels },
  { ...propertyMetadata.actualEmissionsRate.fieldLabels },
  { ...propertyMetadata.avgPlanActual.fieldLabels },
  { ...propertyMetadata.inCompliance.fieldLabels },
];
export const fieldMappings = {
  allowances: {
    holdings: holdings,
    transactions: transactions,
    accountAttributes: accountAttributes,
  },
  compliance: {
    allowance: allowanceCompliance,
    allowanceNbpOtc: allowanceComplianceNbpOtc,
    emissions: emissionsCompliance,
  },
};
