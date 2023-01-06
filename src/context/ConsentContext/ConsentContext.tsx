import { createContext, useState } from 'react';
import api from '../../api';
import { ConsentSituation } from '../../api/services/consent';
import ConsentDataSources, {
  KnownConsentDataSourceNames,
} from '../../constants/ConsentDataSources';

type ConsentSituations = {
  [K in KnownConsentDataSourceNames]?: ConsentSituation;
};

type ConsentContextState = {
  consentSituations: ConsentSituations;
  isConsentInitialized(consentName: KnownConsentDataSourceNames): boolean;
  isConsentGranted(consentName: KnownConsentDataSourceNames): boolean;
  initializeConsentSituation: (
    consentName: KnownConsentDataSourceNames
  ) => Promise<ConsentSituation>;
  redirectToConsentService: (
    consentName: KnownConsentDataSourceNames
  ) => Promise<void>;
};

const contextDefaultValues: ConsentContextState = {
  consentSituations: {},
  isConsentInitialized: (consentName: KnownConsentDataSourceNames) => false,
  isConsentGranted: (consentName: KnownConsentDataSourceNames) => false,
  initializeConsentSituation: (consentName: KnownConsentDataSourceNames) => {
    return Promise.resolve({} as ConsentSituation);
  },
  redirectToConsentService: (consentName: KnownConsentDataSourceNames) => {
    return Promise.resolve();
  },
};

export const ConsentContext =
  createContext<ConsentContextState>(contextDefaultValues);

export function ConsentProvider({ children }: any) {
  const [consentSituations, setConsentSituations] = useState<ConsentSituations>(
    contextDefaultValues.consentSituations
  );

  function isConsentInitialized(
    consentName: KnownConsentDataSourceNames
  ): boolean {
    return typeof consentSituations[consentName] !== 'undefined';
  }

  function isConsentGranted(consentName: KnownConsentDataSourceNames): boolean {
    return consentSituations.USER_PROFILE?.consentStatus === 'consentGranted';
  }

  async function initializeConsentSituation(
    consentName: KnownConsentDataSourceNames
  ): Promise<ConsentSituation> {
    if (!isConsentInitialized(consentName)) {
      await fetchCurrentConsentSituation(consentName);
    }
    return consentSituations[consentName] as ConsentSituation; // Typescript does not know that we checked for undefined
  }

  //
  // Calls to external services
  //
  async function fetchCurrentConsentSituation(
    consentName: KnownConsentDataSourceNames
  ) {
    const dataSource = ConsentDataSources[consentName];
    consentSituations[consentName] = await api.consent.checkConsent(dataSource);
    setConsentSituations(consentSituations);
  }

  async function redirectToConsentService(
    consentName: KnownConsentDataSourceNames
  ): Promise<void> {
    const consentSituation = await initializeConsentSituation(consentName);
    api.consent.directToConsentService(consentSituation);
  }

  return (
    <ConsentContext.Provider
      value={{
        consentSituations,
        isConsentInitialized,
        isConsentGranted,
        initializeConsentSituation,
        redirectToConsentService,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}
