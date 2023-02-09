export enum PlaceType {
  REGION,
  MUNICIPALITY,
  COUNTRY,
}

export interface PlaceSelection {
  type?: PlaceType;
  code: string;
  label: {
    en: string;
  };
  statisticsFinlandCode?: string;
}

export interface JobPostingEntry {
  id: string;
  employer: string;
  location: {
    municipality: string;
    postcode: string;
  };
  basicInfo: {
    title: string;
    description: string;
    workTimeType: string;
  };
  publishedAt: string;
  applicationEndDate: string;
  applicationUrl: string;
  jobsSource: string;
}

export interface RequestPayload {
  search: string | null;
  selectedPlaces: any[];
  limit: number;
  offset: number;
}

export interface JobPostingsRequestPayload {
  query: string;
  location: {
    regions: string[];
    municipalities: string[];
    countries: string[];
  };
  requirements: {
    occupations: string[];
    skills: string[];
  };
  paging: {
    itemsPerPage: number;
    pageNumber: number;
  };
}

export interface JobPostingsResponse {
  results: JobPostingEntry[];
  totalCount: number;
}
