import axios from 'axios';
import {
  appContextUrlEncoded,
  LOCAL_STORAGE_AUTH_TOKENS,
} from '../../constants';
import { JSONLocalStorage } from '../../utils/JSONStorage';
import { AUTH_GW_BASE_URL } from '../endpoints';

export type ConsentSituation = {
  consentStatus: string;
  consentToken?: string;
  redirectUrl?: string;
};

export async function checkConsent(
  dataSourceUri: string,
  consentToken?: string
): Promise<ConsentSituation> {
  const idToken = JSONLocalStorage.get(LOCAL_STORAGE_AUTH_TOKENS).idToken;

  const response = await axios.post(
    `${AUTH_GW_BASE_URL}/consents/testbed/consent-check`,
    JSON.stringify({
      appContext: appContextUrlEncoded,
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
