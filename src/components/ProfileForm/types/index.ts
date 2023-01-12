export interface SelectOption {
  label: string;
  value: string;
}

export enum RegionType {
  REGION = 'region',
  MUNICIPALITY = 'municipality',
}
export interface RegionSelectOption extends SelectOption {
  type: RegionType;
}

export interface SelectGroupedOption {
  label: string;
  options: SelectOption[];
}
