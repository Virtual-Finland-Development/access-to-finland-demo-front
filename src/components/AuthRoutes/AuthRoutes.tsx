import { Box, Container } from '@chakra-ui/react';
import { lazy, Suspense, useContext } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

// context

// components
import {
  ConsentContext,
  ConsentProvider,
} from '../../context/ConsentContext/ConsentContext';
import ConsentSentry from '../ConsentSentry/ConsentSentry';
import Loading from '../Loading/Loading';
import NavBar from '../NavBar/NavBar';
import PageNotFound from '../PageNotFound/PageNotFound';
import Profile from '../Profile/Profile';
import ServicesPage from '../ServicesPage/ServicesPage';
import WelcomePage from '../WelcomePage/WelcomePage';

const LazyTmt = lazy(() => import('../TmtPage/TmtPage'));

/**
 * User needs to give consent to use profile data in vacancies seach
 * Show ConsentSentry to user for approving giving consent before vacancies can be shown
 */
function TmtPageConsentSentry() {
  const { isConsentInitialized, initializeConsentSituation, isConsentGranted } =
    useContext(ConsentContext);

  if (!isConsentInitialized('USER_PROFILE')) {
    initializeConsentSituation('USER_PROFILE');
    return <Loading />;
  }

  if (!isConsentGranted('USER_PROFILE')) {
    return (
      <ConsentSentry
        dataSourceName="USER_PROFILE"
        infoText="To continue to use vacancies search, you need to give your consent to
    use your profile information for search capabilities in third party
    service."
      />
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <LazyTmt />
    </Suspense>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <NavBar />
            <Box>
              <Container maxW="container.xl" pt={6}>
                <Outlet />
              </Container>
            </Box>
          </>
        }
      >
        <Route index element={<WelcomePage />} />
        <Route
          path="vacancies"
          element={
            <ConsentProvider>
              <TmtPageConsentSentry />
            </ConsentProvider>
          }
        />
        <Route path="services" element={<ServicesPage />} />
        <Route path="profile" element={<Profile isEdit />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}
