import {
  customRender1,
  screen,
} from '../../testing/utils/testing-library-utils';
import userEvent from '@testing-library/user-event';
import AppRoot from './AppRoot';

// https://stackoverflow.com/questions/64813447/cannot-read-property-addlistener-of-undefined-react-testing-library
global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };

test('Should show login screen, then profile screen, then logged in app.', async () => {
  customRender1(<AppRoot />);

  // login button in screen
  const loginButton = screen.getByRole('button', {
    name: /login with dummy/i,
  });
  expect(loginButton).toBeInTheDocument();

  // click login button
  userEvent.click(loginButton);

  // profile screen skip button (profile form)
  const skipButton = await screen.findByRole('button', {
    name: /skip/i,
  });
  expect(skipButton).toBeInTheDocument();

  // click skip button
  userEvent.click(skipButton);

  // Access to Finland button should appear in top-left corner the of the app (user is logged in)
  const atfText = await screen.findByRole('button', {
    name: /access to finland/i,
  });
  expect(atfText).toBeInTheDocument();
});
