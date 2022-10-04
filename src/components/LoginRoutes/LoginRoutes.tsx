import { Routes, Route, Outlet } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';

// components
import Login from '../Login/Login';
import Profile from '../Profile/Profile';
import PageNotFound from '../PageNotFound/PageNotFound';

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
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}
