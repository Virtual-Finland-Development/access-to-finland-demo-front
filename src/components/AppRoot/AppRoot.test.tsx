import {
  customRender1,
  customRender2,
  screen,
} from '../../testing/utils/testing-library-utils';
import userEvent from '@testing-library/user-event';
import AppRoot from './AppRoot';

// endpoints
import { AUTH_GW_ENDPOINT } from '../../api/endpoints';

// constants
import { appContextUrlEncoded } from '../../constants';

// https://stackoverflow.com/questions/64813447/cannot-read-property-addlistener-of-undefined-react-testing-library
global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };

describe('Test app authentication based rendering', () => {
  test('Should show login screen, after log in button click loading state appears and login button gets disabled.', async () => {
    customRender1(<AppRoot />);

    // login button in screen
    const loginButton = screen.getByRole('button', {
      name: /login with testbed/i,
    });
    expect(loginButton).toBeInTheDocument();

    // mock location.assign
    window.location.assign = jest.fn();

    // click login button
    userEvent.click(loginButton);

    // once login button clicked, user should be directed to testbed authentication (api gateway route)
    expect(window.location.assign).toBeCalledWith(
      `${AUTH_GW_ENDPOINT}/auth/openid/testbed/login-request?appContext=${appContextUrlEncoded}`
    );

    // login button should be disabled when login action is clicked
    expect(loginButton).toBeDisabled();
  });

  test('User should be authenticated when directed to auth route with loginCode. After authentication, user fills profile information, saves profile and logs in to the app.', async () => {
    // user is redirected to auth route with loginCode query param, user should be logged in
    customRender2(<AppRoot />, {
      initialEntries: ['/auth?provider=testbed&loginCode=123'],
    });

    const profileHeader = await screen.findByRole('heading', {
      name: /fill in your profile/i,
    });
    expect(profileHeader).toBeInTheDocument();

    const saveButton = screen.getByRole('button', {
      name: /save/i,
    });
    expect(saveButton).toBeInTheDocument();

    userEvent.click(saveButton);

    // Access to Finland button should appear in top-left corner the of the app (user is logged in)
    const atfText = await screen.findByRole('button', {
      name: /access to finland/i,
    });
    expect(atfText).toBeInTheDocument();
  });
});
