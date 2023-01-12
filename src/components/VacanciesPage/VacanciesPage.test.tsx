import userEvent from '@testing-library/user-event';
import {
  customRender1,
  screen,
} from '../../testing/utils/testing-library-utils';
import VacanciesPage from './VacanciesPage';

import * as AppContextExports from '../../context/AppContext/AppContext';

describe('VacanciesPage tests', () => {
  beforeEach(() => {
    // mock 'validLoginState' function in AppContext, return true value
    const mockValidLoginState = jest.spyOn(
      AppContextExports,
      'validLoginState'
    );
    mockValidLoginState.mockImplementation(() => true);
  });

  test('Should fetch jobs and show some results', async () => {
    customRender1(<VacanciesPage />);

    const searchInput = await screen.findByLabelText('Word search');
    expect(searchInput).toBeInTheDocument();

    userEvent.type(searchInput, 'cook');

    const submitButton = screen.getByRole('button', { name: /show jobs/i });
    expect(submitButton).toBeInTheDocument();

    userEvent.click(submitButton);

    const jobPostingTitle = await screen.findByText('Kokki Lappiin', {
      exact: false,
    });
    expect(jobPostingTitle).toBeInTheDocument();
  });
});
