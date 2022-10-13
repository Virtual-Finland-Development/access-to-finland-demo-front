import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';

// components
import Login from '../Login/Login';
import Auth from '../Auth/Auth';
import Profile from '../Profile/Profile';
import PageNotFound from '../PageNotFound/PageNotFound';

// context helper function
import { validLoginState } from '../../context/AppContext/AppContext';

/**
 * Protected profile route, redirect to root if login state not valid
 */
function ProtectedProfile() {
  if (!validLoginState()) {
    return <Navigate to="/" replace />;
  }

  return <Profile />;
}

export default function LoginRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Flex minH="100vh" align="center" justify="center" bg="gray.50">
            <Outlet />
          </Flex>
        }
      >
        <Route index element={<Login />} />
        <Route path="auth" element={<Auth />} />
        <Route path="profile" element={<ProtectedProfile />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}
