import axios from 'axios';
import { LOCAL_STORAGE_AUTH_TOKENS } from '../../constants';
import { generateAppContextHash } from '../../utils';
import { JSONLocalStorage } from '../../utils/JSONStorage';
import { AUTH_GW_BASE_URL } from '../endpoints';

export type ConsentSituation =
  | {
      consentStatus: 'consentGranted';
      consentToken: string;
    }
  | {
      consentStatus: 'verifyUserConsent';
      redirectUrl: string;
    }
  | { consentStatus: 'notChecked' };

/**
 * Checks the consent status for a given data source URI.
 *
 * @param dataSourceUri - The data source dpp-URI to check consent for
 * @param consentToken - The consent token to check, if any. If provided the backend API will skip an extra request to the consent service if the token is determined to be valid.
 * @returns
 */
export async function checkConsent(
  dataSourceUri: string,
  consentToken?: string | null
): Promise<ConsentSituation> {
  const idToken = JSONLocalStorage.get(LOCAL_STORAGE_AUTH_TOKENS).idToken;
  const response = await axios.post(
    `${AUTH_GW_BASE_URL}/consents/testbed/consent-check`,
    JSON.stringify({
      appContext: generateAppContextHash(),
      dataSources: [{ uri: dataSourceUri, consentToken: consentToken }],
    }),
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (response.status !== 200 || !(response.data instanceof Array)) {
    throw new Error('Invalid consent data response');
  }

  const consentSituation = response.data.find(
    (situation: { dataSource: string }) =>
      situation.dataSource === dataSourceUri
  );
  if (!consentSituation) {
    throw new Error('Invalid consent data response');
  }
  return consentSituation;
}

export function directToConsentService(consentSituation: ConsentSituation) {
  if (consentSituation.consentStatus !== 'verifyUserConsent') {
    throw new Error('Invalid consent situation');
  }

  const redirectBackUrl = new URL(window.location.href);
  redirectBackUrl.searchParams.set('clear', 'true'); // Applies an url param cleanup after consent flow

  const redirectToServiceUrl = new URL(consentSituation.redirectUrl);
  redirectToServiceUrl.searchParams.set(
    'appContext',
    generateAppContextHash({ redirectUrl: redirectBackUrl })
  );

  window.location.assign(redirectToServiceUrl);
}
