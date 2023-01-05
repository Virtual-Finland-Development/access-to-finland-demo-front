import { Box, Container } from '@chakra-ui/react';
import { lazy, Suspense, useEffect, useState } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

// context

// components
import api from '../../api';
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
  const [consentSituation, setConsentSituation] = useState({
    consentStatus: '',
  });

  useEffect(() => {
    async function fetchConsent() {
      const consentSituation = await api.consent.checkConsent();
      setConsentSituation(consentSituation);
    }
    fetchConsent();
  });

  if (consentSituation.consentStatus !== 'consentGranted') {
    return <ConsentSentry consentSituation={consentSituation} />;
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
        <Route path="profile" element={<Profile isEdit />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}
