import {
  Context,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import api from '../../api';
import { ConsentSituation } from '../../api/services/consent';
import { ConsentDataSource } from '../../constants/ConsentDataSource';
import { getEnumKeyFromValue } from '../../utils';

interface ConsentContextState<ConsentDataSource> {
  dataSource: ConsentDataSource;
  consentSituation: ConsentSituation;
  isConsentInitialized: boolean;
  isConsentGranted: boolean;
  redirectToConsentService: () => void;
}

// Default context state
function getDefaultContextState(
  dataSource: ConsentDataSource
): ConsentContextState<ConsentDataSource> {
  return {
    dataSource: dataSource,
    consentSituation: { consentStatus: '' },
    isConsentInitialized: false,
    isConsentGranted: false,
    redirectToConsentService: () => {},
  };
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
    const initializeConsentSituation = useCallback(async () => {
      if (!isConsentInitialized) {
        await fetchCurrentConsentSituation();
        setIsConsentInitialized(true);
      }
    }, [isConsentInitialized]);

    useEffect(() => {
      initializeConsentSituation();
    }, [initializeConsentSituation]);

    //
    // External service calls
    //
    async function fetchCurrentConsentSituation() {
      const consentStoreKey = `consent-${getEnumKeyFromValue(
        ConsentDataSource,
        dataSource
      )}`;

      const storedConsentToken = sessionStorage.getItem(consentStoreKey);
      const responseSituation = await api.consent.checkConsent(
        dataSource,
        storedConsentToken
      );

      if (responseSituation.consentToken) {
        sessionStorage.setItem(consentStoreKey, responseSituation.consentToken);
      } else if (storedConsentToken) {
        sessionStorage.removeItem(consentStoreKey);
      }

      setConsentSituation(responseSituation);
      setIsConsentGranted(responseSituation.consentStatus === 'consentGranted');
    }

    function redirectToConsentService(): void {
      api.consent.directToConsentService(consentSituation);
    }

    return (
      <ConsentContext.Provider
        value={{
          dataSource,
          consentSituation,
          isConsentInitialized,
          isConsentGranted,
          redirectToConsentService,
        }}
      >
        {children}
      </ConsentContext.Provider>
    );
  };
}

//
// useContext, provider with parameters, keep as singleton
//
const singletonContentContexts: {
  [contextName: string]: {
    ConsentContext: Context<ConsentContextState<ConsentDataSource>>;
    ConsentProvider: React.FC<React.PropsWithChildren>;
    ConsentConsumer: React.Consumer<ConsentContextState<ConsentDataSource>>;
  };
} = {};

/**
 * Creates a ConsentContext and a provider for given data source
 *
 * @param dataSource
 * @returns
 */
export function getConsentContext(dataSource: ConsentDataSource): {
  ConsentContext: Context<ConsentContextState<ConsentDataSource>>;
  ConsentProvider: React.FC<React.PropsWithChildren>;
  ConsentConsumer: React.Consumer<ConsentContextState<ConsentDataSource>>;
} {
  if (typeof singletonContentContexts[dataSource] === 'undefined') {
    const context = createContext<ConsentContextState<ConsentDataSource>>(
      getDefaultContextState(dataSource)
    );
    singletonContentContexts[dataSource] = {
      ConsentContext: context,
      ConsentProvider: getConsentProvider(dataSource, context),
      ConsentConsumer: context.Consumer,
    };
  }
  return singletonContentContexts[dataSource];
}

/**
 * Context as hook
 *
 * @param dataSource
 * @returns
 */
export default function useConsentContext(dataSource: ConsentDataSource) {
  const { ConsentContext } = getConsentContext(dataSource);
  const context = useContext(ConsentContext);

  if (context === undefined || context === null) {
    throw new Error('useAppContext must be used within AppProvider');
  }

  return context;
}