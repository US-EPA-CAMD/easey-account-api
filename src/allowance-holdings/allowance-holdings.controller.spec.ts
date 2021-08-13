import { Test } from '@nestjs/testing';

import { AllowanceHoldingsController } from './allowance-holdings.controller';
import { AllowanceHoldingsService } from './allowance-holdings.service';
import { AllowanceHoldingsMap } from '../maps/allowance-holdings.map';
import { AllowanceHoldingDimRepository } from './allowance-holding-dim.repository';
import { AllowanceHoldingsDTO } from '../dto/allowance-holdings.dto';
import { AllowanceHoldingsParamsDTO } from '../dto/allowance-holdings.params.dto';

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Allowance Holdings Controller --', () => {
  let allowanceHoldingsController: AllowanceHoldingsController;
  let allowanceHoldingsService: AllowanceHoldingsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AllowanceHoldingsController],
      providers: [
        AllowanceHoldingsService,
        AllowanceHoldingsMap,
        AllowanceHoldingDimRepository,
      ],
    }).compile();

    allowanceHoldingsController = module.get(AllowanceHoldingsController);
    allowanceHoldingsService = module.get(AllowanceHoldingsService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* getAllowanceHoldings', () => {
    const req: any = mockRequest('');
    req.res.setHeader.mockReturnValue();

    it('should call the service and return allowance holdings ', async () => {
      const expectedResults: AllowanceHoldingsDTO[] = [];
      const paramsDTO = new AllowanceHoldingsParamsDTO();
      jest
        .spyOn(allowanceHoldingsService, 'getAllowanceHoldings')
        .mockResolvedValue(expectedResults);
      expect(
        await allowanceHoldingsController.getAllowanceHoldings(paramsDTO, req),
      ).toBe(expectedResults);
    });
  });
});