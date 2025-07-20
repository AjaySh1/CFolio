import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import Profile from './pages/Profile';
import Contest from './pages/Contest';
import LeetcodePage from './pages/LeetcodePage';
import CodechefPage from './pages/CodechefPage';
import CodeforcesPage from './pages/CodeforcesPage';
import Start from './pages/Start';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import { useUserProfile } from './context/UserProfileContext';

function App() {
  const { profileData } = useUserProfile();
  return (
    <Routes>
      {/* Public pages without Navbar */}
      <Route path='/' element={<Start />} />
      <Route path='/login' element={<Start/>} />
      <Route path='/signup' element={<SignUp />} />

      {/* Internal pages with Navbar via MainLayout */}
      <Route
        path="/profile"
        element={profileData ? <Profile /> : <Navigate to="/login" />}
      />
      <Route
        path='/contest'
        element={
          <MainLayout>
            <Contest />
          </MainLayout>
        }
      />
      <Route
        path='/leetcode'
        element={
          <MainLayout>
            <LeetcodePage />
          </MainLayout>
        }
      />
      <Route
        path='/codechef'
        element={
          <MainLayout>
            <CodechefPage />
          </MainLayout>
        }
      />
      <Route
        path='/codeforces'
        element={
          <MainLayout>
            <CodeforcesPage />
          </MainLayout>
        }
      />
      <Route
        path='/dashboard'
        element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        }
      />
    </Routes>
  );
}

export default App;