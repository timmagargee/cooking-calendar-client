export const isDateEqual = (a: Date, b: Date): boolean => {
  return new Date(a).toDateString() === new Date(b).toDateString();
};
