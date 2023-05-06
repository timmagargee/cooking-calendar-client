import { WeekDay } from '@angular/common';

const dayTicks = 1000 * 60 * 60 * 24;

export const isDateEqual = (a: Date, b: Date): boolean => {
  return new Date(a).toDateString() === new Date(b).toDateString();
};

export function setToMidnight(date: Date): void {
  date.setHours(0, 0, 0, 0);
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + dayTicks * days);
}

export function getWeekDay(date: Date): string {
  return `${shortDays.get(
    date.getDay() as WeekDay
  )} ${date.getDate()}/${date.getMonth()}`;
}

export const shortDays = new Map<WeekDay, string>([
  [WeekDay.Sunday, 'Sun'],
  [WeekDay.Monday, 'Mon'],
  [WeekDay.Tuesday, 'Tue'],
  [WeekDay.Wednesday, 'Wed'],
  [WeekDay.Thursday, 'Thu'],
  [WeekDay.Friday, 'Fri'],
  [WeekDay.Saturday, 'Sat'],
]);
