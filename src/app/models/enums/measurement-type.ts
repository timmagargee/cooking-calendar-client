import { SelectOption } from '../../custom-inputs/models/select-option';

export enum MeasurementType {
  Amount = 0,
  Tsp = 1,
  Tbl = 2,
  FlOz = 3,
  Gill = 4, //??
  Cup = 5,
  Pt = 6,
  Qt = 7,
  Gal = 8,
  Lb = 9,
  Oz = 10,

  In = 11,
  Yd = 12,
  F = 13,

  //metric
  ML = 101,
  L = 102,
  DL = 103,

  G = 104,
  Kg = 105,

  MM = 106,
  CM = 107,
  M = 108,
  Celcius = 108,
}

const AbbrMeas = new Map<MeasurementType, string>([
  [MeasurementType.Amount, ''],
  [MeasurementType.Tsp, 'tsp.'],
  [MeasurementType.Tbl, 'tbl.'],
  [MeasurementType.FlOz, 'fl. oz.'],
  [MeasurementType.Gill, 'gill'],
  [MeasurementType.Cup, 'c.'],
  [MeasurementType.Pt, 'pt.'],
  [MeasurementType.Qt, 'qt.'],
  [MeasurementType.Lb, 'lb.'],
  [MeasurementType.Oz, 'oz.'],
  [MeasurementType.In, 'in.'],
  [MeasurementType.Yd, 'yd.'],
  [MeasurementType.F, 'F'],
  [MeasurementType.ML, 'ml.'],
  [MeasurementType.L, 'l.'],
  [MeasurementType.G, 'g.'],
  [MeasurementType.Kg, 'kg.'],
  [MeasurementType.MM, 'mm.'],
  [MeasurementType.CM, 'cm.'],
  [MeasurementType.M, 'm.'],
  [MeasurementType.Celcius, 'C'],
]);

const Meas = new Map<MeasurementType, string>([
  [MeasurementType.Amount, ''],
  [MeasurementType.Tsp, 'teaspoon'],
  [MeasurementType.Tbl, 'tablespoon'],
  [MeasurementType.FlOz, 'fluid ounce'],
  [MeasurementType.Gill, 'gill'],
  [MeasurementType.Cup, 'cup'],
  [MeasurementType.Pt, 'pint'],
  [MeasurementType.Qt, 'quart'],
  [MeasurementType.Lb, 'pound'],
  [MeasurementType.Oz, 'ounce'],
  [MeasurementType.In, 'inch'],
  [MeasurementType.Yd, 'yard'],
  [MeasurementType.F, 'farenheight'],
  [MeasurementType.ML, 'milliliter'],
  [MeasurementType.L, 'liter'],
  [MeasurementType.G, 'gram'],
  [MeasurementType.Kg, 'kilogram'],
  [MeasurementType.MM, 'millimeter'],
  [MeasurementType.CM, 'centimeter'],
  [MeasurementType.M, 'meter'],
  [MeasurementType.Celcius, 'celcius'],
]);

export const StandardMeasurementOptions: Array<SelectOption> = [
  { label: '', value: MeasurementType.Amount },
  { label: 'Tsp', value: MeasurementType.Tsp },
  { label: 'Tbl', value: MeasurementType.Tbl },
  { label: 'Fl. Oz', value: MeasurementType.FlOz },

  { label: 'Cup', value: MeasurementType.Cup },
  { label: 'Pt', value: MeasurementType.Pt },
  { label: 'Qt', value: MeasurementType.Qt },
  { label: 'Gal', value: MeasurementType.Gal },

  { label: 'Oz', value: MeasurementType.Oz },
  { label: 'Lb', value: MeasurementType.Lb },

  { label: 'Gill', value: MeasurementType.Gill },
];

export const MetricMeasurementOptions: Array<SelectOption> = [
  { label: '', value: MeasurementType.Amount },
  { label: 'ML', value: MeasurementType.ML },
  { label: 'DL', value: MeasurementType.DL },
  { label: 'L', value: MeasurementType.L },

  { label: 'G', value: MeasurementType.G },
  { label: 'Kg', value: MeasurementType.Kg },
];

export function GetMeasurementString(
  measurement: MeasurementType,
  isAbreviated: boolean = true
) {
  return isAbreviated ? AbbrMeas.get(measurement) : Meas.get(measurement);
}
