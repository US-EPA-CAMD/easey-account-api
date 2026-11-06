import { QueryBuilderHelper } from './query-builder.helper';

describe('QueryBuilderHelper owner/operator filters', () => {
  const payload = "' OR TRUE OR own_display LIKE '";

  const makeQuery = () => ({
    andWhere: jest.fn().mockReturnThis(),
  });

  const expectBoundParameter = (
    query: ReturnType<typeof makeQuery>,
    parameterName: string,
  ) => {
    const [sql, parameters] = query.andWhere.mock.calls[0];
    expect(sql).toContain(`:${parameterName}`);
    expect(sql).not.toContain(payload.toUpperCase());
    expect(parameters[parameterName]).toContain(payload.toUpperCase());
  };

  it('binds account owner/operator text', () => {
    const query = makeQuery();

    QueryBuilderHelper.createAccountQuery(
      query,
      { ownerOperator: [payload] },
      ['ownerOperator'],
      'af',
      'aod',
      true,
    );

    expectBoundParameter(query, 'accountOwnerOperator0');
  });

  it('binds transaction owner/operator text', () => {
    const query = makeQuery();

    QueryBuilderHelper.createTransactionQuery(
      query,
      { ownerOperator: [payload] },
      ['ownerOperator'],
      'at',
      'bat',
      'sat',
      'tt',
    );

    expectBoundParameter(query, 'transactionOwnerOperator0');
  });

  it('binds compliance owner/operator text', () => {
    const query = makeQuery();

    QueryBuilderHelper.createComplianceQuery(
      query,
      { ownerOperator: [payload] },
      ['ownerOperator'],
      'ucd',
      'odf',
    );

    expectBoundParameter(query, 'complianceOwnerOperator0');
  });
});
