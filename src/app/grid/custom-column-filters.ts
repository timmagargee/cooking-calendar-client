import { IFilterOptionDef, ISimpleFilterParams } from 'ag-grid-community';

export const BooleanColumnFilter: ISimpleFilterParams = {
  filterOptions: [
    {
      displayKey: 'all',
      displayName: 'All',
      predicate: (_, cellValue) => true,
      numberOfInputs: 0,
    },
    {
      displayKey: 'true',
      displayName: 'True',
      predicate: (_, cellValue) => cellValue,
      numberOfInputs: 0,
    },
    {
      displayKey: 'false',
      displayName: 'False',
      predicate: (_, cellValue) => !cellValue,
      numberOfInputs: 0,
    },
  ] as IFilterOptionDef[],
  suppressAndOrCondition: true,
};
