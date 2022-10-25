import { rest } from 'msw';

// endpoints
import { AUTH_GW_ENDPOINT, USER_API_ENDPOINT } from '../../api/endpoints';

const mockUser = {
  id: '12312-123123-asdasd',
  firstName: 'Donald',
  lastName: 'Duck',
  address: '1313 Webfoot Street, Duckburg',
  jobTitles: ['Developer'],
  regions: ['01', '02'],
  created: '2022-10-12T12:05:46.6262126Z',
  modified: '2022-10-12T12:05:46.6262127Z',
};

/**
 * msw handlers to override HTTP request for testing
 */
export const handlers = [
  rest.post(
    `${AUTH_GW_ENDPOINT}/auth/openid/testbed/auth-token-request`,
    (req, res, ctx) => {
      return res(ctx.json({ token: '123-random-token' }));
    }
  ),
  rest.post(
    `${AUTH_GW_ENDPOINT}/auth/openid/testbed/user-info-request`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          name: '1231232asdasdADasd2',
          sub: '1231232asdasdADasd2',
        })
      );
    }
  ),
  rest.get(`${USER_API_ENDPOINT}/identity/testbed/verify`, (req, res, ctx) => {
    return res(
      ctx.json({
        id: mockUser.id,
        created: mockUser.created,
        modified: mockUser.modified,
      })
    );
  }),
  rest.get(`${USER_API_ENDPOINT}/user`, (req, res, ctx) => {
    return res(ctx.json(mockUser));
  }),
  rest.patch(`${USER_API_ENDPOINT}/user`, (req, res, ctx) => {
    return res(ctx.json(mockUser));
  }),
  rest.get(`${USER_API_ENDPOINT}/code-sets/countries`, (req, res, ctx) => {
    return res(
      ctx.json([
        {
          displayName: 'Aruba',
          englishName: 'Aruba',
          id: 'AW',
          nativeName: '',
          threeLetterISOCode: 'ABW',
          twoLetterISOCode: 'AW',
        },
      ])
    );
  }),
  rest.get(`${USER_API_ENDPOINT}/code-sets/occupations`, (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: '0',
          name: {
            en: 'Armed forces',
          },
        },
      ])
    );
  }),
  rest.get(`${USER_API_ENDPOINT}/code-sets/languages`, (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: '',
          displayName: 'Invariant Language (Invariant Country)',
          englishName: 'Invariant Language (Invariant Country)',
          nativeName: 'Invariant Language (Invariant Country)',
          twoLetterISORegionName: 'iv',
          threeLetterISORegionName: 'ivl',
        },
      ])
    );
  }),
];
