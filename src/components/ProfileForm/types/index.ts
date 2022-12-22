export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectGroupedOption {
  label: string;
  options: SelectOption[];
}
