// types
import { PlaceType, PlaceSelection, JobPostingsRequestPayload } from '../types';
import { OccupationOption } from '../../../@types';

/**
 * Construct find-job-postings payload for testbed-api
 */
export function constructJobPostingsPayload({
  search,
  selectedPlaces,
  selectedOccupations,
  itemsPerPage,
}: {
  search: string | null;
  selectedPlaces: PlaceSelection[] | null;
  selectedOccupations: OccupationOption[] | null;
  itemsPerPage: number;
}): JobPostingsRequestPayload {
  return {
    query: typeof search === 'string' ? search.split(' ').toString() : '',
    location: {
      regions: selectedPlaces
        ? selectedPlaces
            .filter(p => p.type === PlaceType.REGION)
            .map(p => p.Koodi)
        : [],
      municipalities: selectedPlaces
        ? selectedPlaces
            .filter(p => p.type === PlaceType.MUNICIPALITY)
            .map(p => p.Koodi)
        : [],
      countries: selectedPlaces
        ? selectedPlaces
            .filter(p => p.type === PlaceType.COUNTRY)
            .map(p => p.Koodi)
        : [],
    },
    requirements: {
      occupations: selectedOccupations
        ? selectedOccupations.map(o => o.uri)
        : [],
      skills: [],
    },
    paging: {
      itemsPerPage: itemsPerPage,
      pageNumber: 0,
    },
  };
}
