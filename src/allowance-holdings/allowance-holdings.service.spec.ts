import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { AllowanceHoldingsService } from './allowance-holdings.service';
import { AllowanceHoldingDimRepository } from './allowance-holding-dim.repository';
import { AllowanceHoldingsMap } from '../maps/allowance-holdings.map';
import { PaginatedAllowanceHoldingsParamsDTO } from '../dto/allowance-holdings.params.dto';

const mockAllowanceHoldingDimRepository = () => ({
  getAllowanceHoldings: jest.fn(),
  getAllApplicableAllowanceHoldingsAttributes: jest.fn(),
});

const mockAllowanceHoldingsMap = () => ({
  many: jest.fn(),
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

let req: any;

describe('-- Allowance Holdings Service --', () => {
  let allowanceHoldingsService;
  let allowanceHoldingDimRepository;
  let allowanceHoldingsMap;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        AllowanceHoldingsService,
        {
          provide: AllowanceHoldingDimRepository,
          useFactory: mockAllowanceHoldingDimRepository,
        },
        { provide: AllowanceHoldingsMap, useFactory: mockAllowanceHoldingsMap },
      ],
    }).compile();

    allowanceHoldingsService = module.get(AllowanceHoldingsService);
    allowanceHoldingDimRepository = module.get(AllowanceHoldingDimRepository);
    allowanceHoldingsMap = module.get(AllowanceHoldingsMap);

    req = mockRequest();
    req.res.setHeader.mockReturnValue();
  });

  describe('getAllowanceHoldings', () => {
    it('calls AllowanceHoldingDimRepository.getAllowanceHoldings() and gets all allowance holdings from the repository', async () => {
      allowanceHoldingDimRepository.getAllowanceHoldings.mockResolvedValue(
        'list of allowance holdings',
      );
      allowanceHoldingsMap.many.mockReturnValue('mapped DTOs');

      let filters = new PaginatedAllowanceHoldingsParamsDTO();

      let result = await allowanceHoldingsService.getAllowanceHoldings(
        filters,
        req,
      );
      expect(allowanceHoldingsMap.many).toHaveBeenCalled();
      expect(result).toEqual('mapped DTOs');
    });
  });
});
