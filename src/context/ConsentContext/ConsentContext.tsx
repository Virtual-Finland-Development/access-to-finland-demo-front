import { Context, createContext, useState } from 'react';
import api from '../../api';
import { ConsentSituation } from '../../api/services/consent';
import { ConsentDataSource } from '../../constants/ConsentDataSource';

interface ConsentContextState<ConsentDataSource> {
  dataSource?: ConsentDataSource;
  consentSituation: ConsentSituation;
  isConsentInitialized: boolean;
  isConsentGranted: boolean;
  initializeConsentSituation: () => Promise<ConsentSituation>;
  redirectToConsentService: () => void;
}

//
// useContext, provider with parameters, keep as singleton
//
const singletonContentContexts: {
  [contextName: string]: {
    ConsentContext: Context<ConsentContextState<ConsentDataSource>>;
    ConsentProvider: React.FC;
  };
} = {};

/**
 *
 * @param consentName
 * @returns
 */
export default function getConsentContext(dataSource: ConsentDataSource): {
  ConsentContext: Context<ConsentContextState<ConsentDataSource>>;
  ConsentProvider: any;
} {
  if (typeof singletonContentContexts[dataSource] === 'undefined') {
    const context = createContext<ConsentContextState<ConsentDataSource>>({
      dataSource: dataSource,
      consentSituation: { consentStatus: '' },
      isConsentInitialized: false,
      isConsentGranted: false,
      initializeConsentSituation: () => {
        return Promise.resolve({} as ConsentSituation);
      },
      redirectToConsentService: () => {},
    });
    singletonContentContexts[dataSource] = {
      ConsentContext: context,
      ConsentProvider: getConsentProvider(dataSource, context),
    };
  }
  return singletonContentContexts[dataSource];
}

/**
 * Creates a ConsentProvider for given context
 *
 * @param context
 * @returns
 */
function getConsentProvider(
  dataSource: ConsentDataSource,
  ConsentContext: Context<ConsentContextState<ConsentDataSource>>
) {
  return function ConsentProvider({ children }: React.PropsWithChildren) {
    //
    // Reactive flags and states
    //
    const [consentSituation, setConsentSituation] = useState<ConsentSituation>({
      consentStatus: '',
    });
    const [isConsentInitialized, setIsConsentInitialized] =
      useState<boolean>(false);
    const [isConsentGranted, setIsConsentGranted] = useState<boolean>(false);

    //
    // Actions
    //
    async function initializeConsentSituation(): Promise<ConsentSituation> {
      if (!isConsentInitialized) {
        await fetchCurrentConsentSituation();
        setIsConsentInitialized(true);
      }
      return consentSituation;
    }

    //
    // External service calls
    //
    async function fetchCurrentConsentSituation() {
      const responseSituation = await api.consent.checkConsent(dataSource);
      setConsentSituation(responseSituation);
      setIsConsentGranted(responseSituation.consentStatus === 'consentGranted');
    }

    function redirectToConsentService(): void {
      api.consent.directToConsentService(consentSituation);
    }

    return (
      <ConsentContext.Provider
        value={{
          consentSituation,
          isConsentInitialized,
          isConsentGranted,
          initializeConsentSituation,
          redirectToConsentService,
        }}
      >
        {children}
      </ConsentContext.Provider>
    );
  };
}
