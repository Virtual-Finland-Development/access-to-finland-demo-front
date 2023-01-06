export type KnownConsentDataSourceNames = 'USER_PROFILE';

const ConsentDataSources: { [K in KnownConsentDataSourceNames]: string } = {
  USER_PROFILE:
    'dpp://access_to_finland@testbed.fi/test/lassipatanen/User/Profile',
};
export default ConsentDataSources;
