import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { AllowanceTransactionsService } from './allowance-transactions.service';
import { TransactionBlockDimRepository } from './transaction-block-dim.repository';
import { AllowanceTransactionsMap } from '../maps/allowance-transactions.map';
import { AllowanceTransactionsParamsDTO } from '../dto/allowance-transactions.params.dto';
import { TransactionOwnerDim } from '../entities/transaction-owner-dim.entity';
import { OwnerOperatorsDTO } from '../dto/owner-operators.dto';
import { TransactionOwnerDimRepository } from './transaction-owner-dim.repository';
import { OwnerOperatorsMap } from '../maps/owner-operators.map';

const mockTransactionBlockDimRepository = () => ({
  getAllowanceTransactions: jest.fn(),
  getAllApplicableAllowanceTransactionsAttributes: jest.fn(),
});

jest.mock('uuid', () => {
  return { v4: jest.fn().mockReturnValue(0) };
});

const mockRequest = (url?: string, page?: number, perPage?: number) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
    query: {
      page,
      perPage,
    },
    headers: {
      accept: 'text/csv',
    },
    on: jest.fn(),
  };
};

const mockAllowanceTransactionsMap = () => ({
  many: jest.fn(),
});

const mockTransactionOwnerDimRepository = () => ({
  getAllOwnerOperators: jest.fn(),
});

let req: any;

describe('-- Allowance Transactions Service --', () => {
  let allowanceTransactionsService;
  let transactionBlockDimRepository;
  let transactionOwnerDimRepository;
  let allowanceTransactionsMap;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        AllowanceTransactionsService,
        {
          provide: TransactionBlockDimRepository,
          useFactory: mockTransactionBlockDimRepository,
        },
        {
          provide: TransactionOwnerDimRepository,
          useFactory: mockTransactionOwnerDimRepository,
        },
        {
          provide: AllowanceTransactionsMap,
          useFactory: mockAllowanceTransactionsMap,
        },
        OwnerOperatorsMap,
      ],
    }).compile();

    allowanceTransactionsService = module.get(AllowanceTransactionsService);
    transactionBlockDimRepository = module.get(TransactionBlockDimRepository);
    transactionOwnerDimRepository = module.get(TransactionOwnerDimRepository);
    allowanceTransactionsMap = module.get(AllowanceTransactionsMap);
    req = mockRequest();
    req.res.setHeader.mockReturnValue();
  });

  describe('getAllowanceTransactions', () => {
    it('calls TransactionBlockDimRepository.getAllowanceTransactions() and gets all allowance transactions from the repository', async () => {
      transactionBlockDimRepository.getAllowanceTransactions.mockResolvedValue(
        'list of allowance transactions',
      );
      allowanceTransactionsMap.many.mockReturnValue('mapped DTOs');

      let filters = new AllowanceTransactionsParamsDTO();

      let result = await allowanceTransactionsService.getAllowanceTransactions(
        filters,
        req,
      );
      expect(allowanceTransactionsMap.many).toHaveBeenCalled();
      expect(result).toEqual('mapped DTOs');
    });
  });

  describe('getAllOwnerOperators', () => {
    it('repository.getAllOwnerOperators() and returns all valid owner/operators', async () => {
      let transactionOwnerDimEntity: TransactionOwnerDim = new TransactionOwnerDim();
      transactionOwnerDimEntity.ownId = 0;
      transactionOwnerDimEntity.ownerOperator = '';
      transactionOwnerDimEntity.ownType = '';

      const ownerOperatorsDTO: OwnerOperatorsDTO = {
        ownerOperator: '',
        ownType: '',
      };

      transactionOwnerDimRepository.getAllOwnerOperators.mockResolvedValue([
        transactionOwnerDimEntity,
      ]);

      let result = await allowanceTransactionsService.getAllOwnerOperators();

      expect(
        transactionOwnerDimRepository.getAllOwnerOperators,
      ).toHaveBeenCalled();
      expect(result).toEqual([ownerOperatorsDTO]);
    });
  });
});
