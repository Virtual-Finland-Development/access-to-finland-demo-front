import { lazy, Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Box, Container } from '@chakra-ui/react';

// context
import { useAppContext } from '../../context/AppContext/AppContext';

// components
import WelcomePage from '../WelcomePage/WelcomePage';
import ServicesPage from '../ServicesPage/ServicesPage';
import NavBar from '../NavBar/NavBar';
import Loading from '../Loading/Loading';
import PageNotFound from '../PageNotFound/PageNotFound';
import ConsentSentry from '../ConsentSentry/ConsentSentry';

const LazyTmt = lazy(() => import('../TmtPage/TmtPage'));

/**
 * User needs to give consent to use profile data in vacancies seach
 * Show ConsentSentry to user for approving giving consent before vacancies can be shown
 */
function TmtPageConsentSentry() {
  const {
    userProfile: { jobsDataConsent },
  } = useAppContext();

  if (!jobsDataConsent) {
    return <ConsentSentry />;
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
        <Route path="vacancies" element={<TmtPageConsentSentry />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}
