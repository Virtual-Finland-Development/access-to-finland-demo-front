import { rest } from 'msw';

// endpoints
import {
  AUTH_GW_BASE_URL,
  TESTBED_API_BASE_URL,
  USERS_API_BASE_URL,
} from '../../api/endpoints';

const mockAuthUser = {
  idToken: 'test-token',
  expiresAt: '2022-11-18T12:22:35.000Z',
  profileData: {
    userId: '123245345345345',
    email: 'test@tester.testbed.fi',
    profile: {
      email: 'test@tester.testbed.fi',
      sub: '456456456365',
      name: '123123123123',
    },
  },
};

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

const mockJobPostings = {
  results: [
    {
      id: '12312342345',
      applicationEndDate: '2023-01-31T13:00:00+00:00',
      applicationUrl: null,
      basicInfo: {
        description:
          'Koetko Lapin kutsuvan sinua talvikaudella 2022 - 2023? Haluatko olla mukana luomassa parasta ruokakokemusta asiakkaillesi? Proextra hakee useampaa kokkia Lapin eri hiihtokeskuksiin talvikaudeksi 2022 - 2023. \nTöiden aloitus olisi loka-marraskuu huhtikuulle saakka. Palkkaus TES:in mukaan kokemusvuodet huomioiden tai sopimuksen mukaan.\n\nKimppa-asunto järjestyy läheltä työpaikkaa, vuokra 200-300€/kk.\n\n ',
        title: 'Kokki Lappiin',
        workTimeType: '01',
      },
      employer: '',
      location: {
        municipality: '',
        postcode: '',
      },
      publishedAt: '2022-08-24T10:21:24+00:00',
    },
  ],
};

/**
 * msw handlers to override HTTP request for testing
 */
export const handlers = [
  rest.post(
    `${AUTH_GW_BASE_URL}/auth/openid/testbed/login-request`,
    (req, res, ctx) => {
      return res(ctx.json(mockAuthUser));
    }
  ),
  rest.post(
    `${AUTH_GW_BASE_URL}/auth/openid/testbed/user-info-request`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          name: '1231232asdasdADasd2',
          sub: '1231232asdasdADasd2',
        })
      );
    }
  ),
  rest.get(`${USERS_API_BASE_URL}/identity/verify`, (req, res, ctx) => {
    return res(
      ctx.json({
        id: mockUser.id,
        created: mockUser.created,
        modified: mockUser.modified,
      })
    );
  }),
  rest.get(`${USERS_API_BASE_URL}/user`, (req, res, ctx) => {
    return res(ctx.json(mockUser));
  }),
  rest.patch(`${USERS_API_BASE_URL}/user`, (req, res, ctx) => {
    return res(ctx.json(mockUser));
  }),
  rest.get(`${USERS_API_BASE_URL}/code-sets/countries`, (req, res, ctx) => {
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
  rest.get(`${USERS_API_BASE_URL}/code-sets/occupations`, (req, res, ctx) => {
    return res(
      ctx.json([
        {
          notation: '0',
          uri: '',
          prefLabel: {
            en: 'Armed forces',
          },
        },
      ])
    );
  }),
  rest.get(
    `${USERS_API_BASE_URL}/code-sets/occupations-flat`,
    (req, res, ctx) => {
      return res(
        ctx.json([
          {
            notation: '0',
            uri: '',
            prefLabel: {
              en: 'Armed forces',
            },
          },
        ])
      );
    }
  ),
  rest.get(`${USERS_API_BASE_URL}/code-sets/languages`, (req, res, ctx) => {
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
  rest.post(
    `${TESTBED_API_BASE_URL}/testbed/productizers/find-job-postings`,
    (req, res, ctx) => {
      return res(ctx.json(mockJobPostings));
    }
  ),
  rest.get(`${TESTBED_API_BASE_URL}/wake-up`, (req, res, ctx) => {
    return res();
  }),
];
