import { Routes, Route } from 'react-router-dom';

// components
import Login from '../Login/Login';
import Profile from '../Profile/Profile';
// import PageNotFound from '../PageNotFound/PageNotFound';

export default function LoginRoutes() {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path="profile" element={<Profile />} />
      {/* <Route path="*" element={<PageNotFound />} /> */}
    </Routes>
  );
}
