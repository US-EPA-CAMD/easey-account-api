import { Repository, EntityRepository } from 'typeorm';

import { TransactionOwnerDim } from '../entities/transaction-owner-dim.entity';

@EntityRepository(TransactionOwnerDim)
export class TransactionOwnerDimRepository extends Repository<
  TransactionOwnerDim
> {
  async getAllOwnerOperators(): Promise<TransactionOwnerDim[]> {
    const query = this.createQueryBuilder('tod')
      .select(['tod.ownId', 'tod.ownerOperator', 'tod.ownType'])
      .distinctOn(['tod.ownId', 'tod.ownType'])
      .orderBy('tod.ownId');
    return query.getMany();
  }
}
