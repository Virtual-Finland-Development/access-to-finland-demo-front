import { lazy, Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Box, Container, useBreakpointValue } from '@chakra-ui/react';

// components
import WelcomePage from '../WelcomePage/WelcomePage';
import NavBar from '../NavBar/NavBar';
import Loading from '../Loading/Loading';
import PageNotFound from '../PageNotFound/PageNotFound';

const LazyTmt = lazy(() => import('../TmtPage/TmtPage'));

const About = () => {
  return <div>About page</div>;
};

export default function AppRoutes() {
  // layout container height calculation - subtract navbar height from viewport height
  const minH = useBreakpointValue({
    base: 'calc(100vh - 71px)',
    md: 'calc(100vh - 119px)',
  });

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <NavBar />
            <Box minH={minH} bg="gray.50">
              <Container maxW="container.xl" pt={4}>
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
            <Suspense fallback={<Loading />}>
              <LazyTmt />
            </Suspense>
          }
        />
        <Route path="about" element={<About />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}
