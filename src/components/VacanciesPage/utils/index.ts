// types
import { PlaceType, PlaceSelection, JobPostingsRequestPayload } from '../types';
import { OccupationOption, UserProfile, Occupation } from '../../../@types';

// selections
import regions from '../regionJsons/regions.json';
import municipalities from '../regionJsons/municipalities.json';

/**
 * Return initial state values from userProfile for VacanciesPage
 */
export function getInitialStateValues(userProfile: UserProfile) {
  let initialSearch = '';
  let initialOccupationNotations: string[] = [];
  let initialSelectedPlaces: PlaceSelection[] = [];

  if (userProfile.jobTitles?.length) {
    initialSearch = userProfile.jobTitles.join(' ');
  }

  if (userProfile.occupations?.length) {
    initialOccupationNotations = userProfile.occupations.map(
      (o: Occupation) => o.escoCode || ''
    );
  }

  if (userProfile.workPreferences) {
    const selectedRegionCodes = [
      ...(userProfile.workPreferences.preferredRegionEnum || []),
      ...(userProfile.workPreferences.preferredMunicipalityEnum || []),
    ];
    // merge region and municipality selections, map each and set type
    const selections: PlaceSelection[] = [
      ...regions.map(r => ({ ...r, type: PlaceType.REGION })),
      ...municipalities.map(m => ({ ...m, type: PlaceType.MUNICIPALITY })),
    ];
    // reduce userProfile regions, find matches and set to selected places
    initialSelectedPlaces = selectedRegionCodes.reduce(
      (acc: PlaceSelection[], code: string) => {
        const selected = selections.find(s => s.Koodi === code);
        if (selected) acc.push(selected);
        return acc;
      },
      []
    );
  }

  return {
    initialSearch,
    initialOccupationNotations,
    initialSelectedPlaces,
  };
}

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
