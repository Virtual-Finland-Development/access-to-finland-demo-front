import { lazy, Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Box, Container } from '@chakra-ui/react';

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
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <NavBar />
            <Box minH="100vh" bg="gray.50">
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
