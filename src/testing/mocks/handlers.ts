import { rest } from 'msw';

// api
import api from '../../api';

/**
 * msw handlers to override HTTP request for testing
 */
export const handlers = [
  rest.post('some-url-here', (req, res, ctx) => {
    return res(ctx.json({}));
  }),
];
