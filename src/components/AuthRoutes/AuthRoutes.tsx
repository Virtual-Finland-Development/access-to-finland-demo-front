import { Box, Container } from '@chakra-ui/react';
import { lazy, Suspense, useContext } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import { ConsentDataSource } from '../../constants/ConsentDataSource';

// context

// components
import { getConsentContext } from '../../context/ConsentContext/ConsentContextFactory';
import ConsentSentry from '../ConsentSentry/ConsentSentry';
import Loading from '../Loading/Loading';
import NavBar from '../NavBar/NavBar';
import PageNotFound from '../PageNotFound/PageNotFound';
import Profile from '../Profile/Profile';
import ServicesPage from '../ServicesPage/ServicesPage';
import WelcomePage from '../WelcomePage/WelcomePage';

const LazyTmt = lazy(() => import('../TmtPage/TmtPage'));

// Get context and provider for given data source
const { ConsentContext, ConsentProvider } = getConsentContext(
  ConsentDataSource.USER_PROFILE
);

/**
 * User needs to give consent to use profile data in vacancies seach
 * Show ConsentSentry to user for approving giving consent before vacancies can be shown
 */
function TmtPageConsentSentry() {
  const { isConsentInitialized, isConsentGranted, redirectToConsentService } =
    useContext(ConsentContext);

  if (!isConsentInitialized) {
    return <Loading />;
  }

  if (!isConsentGranted) {
    return (
      <ConsentSentry
        approveFunction={redirectToConsentService}
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
        <Route
          path="profile"
          element={
            <ConsentProvider>
              <Profile isEdit />
            </ConsentProvider>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}
