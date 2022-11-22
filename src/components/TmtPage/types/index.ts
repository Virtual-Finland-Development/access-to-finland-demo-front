export enum PlaceType {
  REGION,
  MUNICIPALITY,
  COUNTRY,
}

export interface PlaceSelection {
  type?: PlaceType;
  Alkupaiva: string;
  Koodi: string;
  Laajennukset?: any[];
  Loppupaiva: string;
  Muokkausaika: string;
  Selitteet: {
    Kielikoodi: string;
    Teksti: string;
  }[];
}

export interface JobPostingEntry {
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
}

export interface RequestPayload {
  search: string | null;
  selectedPlaces: any[];
  limit: number;
  offset: number;
}

/* const payload = {
        query: typeof search === 'string' ? search.split(' ').toString() : '',
        location: {
          regions: selectedPlaces
            .filter(p => p.type === PlaceType.REGION)
            .map(p => p.Koodi),
          municipalities: selectedPlaces
            .filter(p => p.type === PlaceType.MUNICIPALITY)
            .map(p => p.Koodi),
          countries: selectedPlaces
            .filter(p => p.type === PlaceType.COUNTRY)
            .map(p => p.Koodi),
        },
        paging: {
          limit: paginationState.limit || 25,
          offset: paginationState.offset || 0,
        },
      }; */

export interface JobPostingsRequestPayload {
  query: string;
  location: {
    regions: string[];
    municipalities: string[];
    countries: string[];
  };
  paging: {
    limit: number;
    offset: number;
  };
}
