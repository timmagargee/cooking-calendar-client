export interface UserSettingsDto {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isDefaultMeasurementStandard: boolean;
  isDarkMode: boolean;
  defaultShoppingDay?: number;
  defaultServings?: number;
}
