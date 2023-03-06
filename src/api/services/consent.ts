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
  try {
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
  } catch (error) {
    return {
      consentStatus: 'error',
    }
  }
}

export function directToConsentService(consentSituation: ConsentSituation) {
  if (!consentSituation.redirectUrl) {
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
