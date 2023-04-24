import { SelectOption } from 'src/app/custom-inputs/models/select-option';

export enum AmountType {
  Decimal = 1,
  Fraction = 3,
  Mixed = 2,
}

export const AmountTypeOptions: Array<SelectOption> = [
  { label: 'Decimal', value: AmountType.Decimal },
  { label: 'Fraction', value: AmountType.Fraction },
  { label: 'Mixed', value: AmountType.Mixed },
];
