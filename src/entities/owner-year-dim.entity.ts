import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

import { UnitFact } from './unit-fact.entity';

@Entity({ name: 'camddmw.owner_year_dim' })
export class OwnerYearDim extends BaseEntity {
  @PrimaryColumn({
    name: 'own_yr_id',
    transformer: new NumericColumnTransformer(),
  })
  ownYearId: number;

  @PrimaryColumn({
    name: 'unit_id',
  })
  id: string;

  @PrimaryColumn({
    name: 'op_year',
    transformer: new NumericColumnTransformer(),
  })
  year: number;

  @PrimaryColumn({
    name: 'own_type',
  })
  ownType: string;

  @Column({
    name: 'own_id',
    transformer: new NumericColumnTransformer(),
  })
  ownId: number;

  @Column({
    name: 'own_display',
  })
  ownerOperator: string;

  @OneToMany(
    () => UnitFact,
    uf => uf.ownerYearDim,
  )
  unitFact: UnitFact[];
}
