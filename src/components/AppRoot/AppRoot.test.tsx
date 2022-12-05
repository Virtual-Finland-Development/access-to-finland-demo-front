import userEvent from '@testing-library/user-event';
import {
  customRender1,
  customRender2,
  screen,
} from '../../testing/utils/testing-library-utils';
import AppRoot from './AppRoot';

import * as AppContextExports from '../../context/AppContext/AppContext';

// endpoints
import { AUTH_GW_BASE_URL } from '../../api/endpoints';

// constants
import { appContextUrlEncoded } from '../../constants';

describe('Test app authentication based rendering', () => {
  beforeEach(() => {
    // mock 'validLoginState' function in AppContext, return true value
    const mockValidLoginState = jest.spyOn(
      AppContextExports,
      'validLoginState'
    );
    mockValidLoginState.mockImplementation(() => true);
  });

  test('Should show login screen, after log in button click loading state appears and login button gets disabled.', async () => {
    customRender1(<AppRoot />);

    // login button in screen
    const loginButton = screen.getByRole('button', {
      name: /login with testbed/i,
    });
    expect(loginButton).toBeInTheDocument();

    // click login button
    userEvent.click(loginButton);

    // once login button clicked, user should be directed to testbed authentication (api gateway route)
    expect(window.location.assign).toBeCalledWith(
      `${AUTH_GW_BASE_URL}/auth/openid/testbed/authentication-request?appContext=${appContextUrlEncoded}`
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
      name: /please fill your profile information to continue/i,
    });
    expect(profileHeader).toBeInTheDocument();

    const saveButton = await screen.findByRole('button', {
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

  test('User clicks sign out, logout request should occur.', async () => {
    // user is redirected to auth route with loginCode query param, user should be logged in
    customRender2(<AppRoot />, {
      initialEntries: ['/auth?provider=testbed&loginCode=123'],
    });

    // logout button should be visible once user has authenticated (profile view)
    const logoutButton = await screen.findByRole('button', {
      name: /sign out/i,
    });
    expect(logoutButton).toBeInTheDocument();

    userEvent.click(logoutButton);

    // once log out button clicked, user should be directed to authentication log out (api gateway route)
    expect(window.location.assign).toBeCalledWith(
      `${AUTH_GW_BASE_URL}/auth/openid/testbed/logout-request?appContext=${appContextUrlEncoded}&idToken=test-token`
    );

    // loading spinner should appear
    const loadingSpinner = await screen.findByText(/loading.../i);
    expect(loadingSpinner).toBeInTheDocument();
  });

  test('User should be logged out, when logout redirect has occured.', async () => {
    // user is redirected to auth route with log out query param
    customRender2(<AppRoot />, {
      initialEntries: ['/auth?logout=success'],
    });

    // user should be logged out, login button should appear in the document
    const loginButton = await screen.findByRole('button', {
      name: /login with testbed/i,
    });
    expect(loginButton).toBeInTheDocument();
  });
});
