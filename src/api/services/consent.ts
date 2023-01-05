import axios from 'axios';
import {
  appContextUrlEncoded,
  LOCAL_STORAGE_AUTH_TOKENS,
} from '../../constants';
import { JSONLocalStorage } from '../../utils';
import { AUTH_GW_BASE_URL } from '../endpoints';

const consentDataSource =
  'dpp://access_to_finland@testbed.fi/test/lassipatanen/User/Profile';

export type ConsentSituation = {
  consentStatus: string;
  consentToken?: string;
  redirectUrl?: string;
};

export async function checkConsent(
  dataSource: string = consentDataSource
): Promise<ConsentSituation> {
  const idToken = JSONLocalStorage.get(LOCAL_STORAGE_AUTH_TOKENS).idToken;

  return await axios.post(
    `${AUTH_GW_BASE_URL}/consents/testbed/consent-check`,
    JSON.stringify({
      appContext: appContextUrlEncoded,
      dataSource: dataSource,
    }),
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
}

export function directToConsentService(consentSituation: ConsentSituation) {
  if (!consentSituation.redirectUrl) {
    throw new Error('Invalid consent situation');
  }
  window.location.assign(consentSituation.redirectUrl);
}
