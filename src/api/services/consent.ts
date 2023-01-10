import axios from 'axios';
import { LOCAL_STORAGE_AUTH_TOKENS } from '../../constants';
import { generateAppContextHash } from '../../utils';
import { JSONLocalStorage } from '../../utils/JSONStorage';
import { AUTH_GW_BASE_URL } from '../endpoints';

export type ConsentSituation = {
  consentStatus: string;
  consentToken?: string;
  redirectUrl?: string;
};

/**
 *
 * @param dataSourceUri
 * @param consentToken, if provided the consent token is verified, otherwise a new consent token is requested from the testbed consent api
 * @returns
 */
export async function checkConsent(
  dataSourceUri: string,
  consentToken?: string | null
): Promise<ConsentSituation> {
  const idToken = JSONLocalStorage.get(LOCAL_STORAGE_AUTH_TOKENS).idToken;

  const redirectUrl = new URL(window.location.href); // redirect back to the current page
  redirectUrl.searchParams.set('clear', 'true'); // Applies an url param cleanup after consent flow

  const response = await axios.post(
    `${AUTH_GW_BASE_URL}/consents/testbed/consent-check`,
    JSON.stringify({
      appContext: generateAppContextHash({ redirectUrl: redirectUrl }),
      dataSources: [{ uri: dataSourceUri, consentToken: consentToken }],
    }),
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );

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
  if (!consentSituation.redirectUrl) {
    throw new Error('Invalid consent situation');
  }
  window.location.assign(consentSituation.redirectUrl);
}
