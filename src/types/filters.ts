export interface AlertType {
  id: string;
  name: string;
}

export interface Filters {
  alertTypes: string[];
  regions: string[];
  neighborhoods: string[];
  conditionLevels: number[];
}