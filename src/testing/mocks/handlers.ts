import { rest } from 'msw';

// endpoints
import { AUTH_GW_ENDPOINT, USER_API_ENDPOINT } from '../../api/endpoints';

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
        id: '12312-123123-asdasd',
        created: '2022-10-12T12:05:46.6262126Z',
        modified: '2022-10-12T12:05:46.6262127Z',
      })
    );
  }),
  rest.patch(`${USER_API_ENDPOINT}/user`, (req, res, ctx) => {
    return res(
      ctx.json({
        firstName: 'Donald',
        lastName: 'Duck',
        address: '1313 Webfoot Street, Duckburg',
        jobTitles: ['Developer'],
        regions: ['01', '02'],
        created: '2022-10-12T12:05:46.6262126Z',
        modified: '2022-10-12T12:05:46.6262127Z',
      })
    );
  }),
];
