import { createBrowserRouter } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Start from "./pages/Start";
import PrivateRoute from "./components/PrivateRoute";
import LeetcodePage from "./pages/LeetcodePage";
import CodechefPage from "./pages/CodechefPage";
import CodeforcesPage from "./pages/CodeforcesPage";
import Dashboard from "./pages/Dashboard";
import Contest from "./pages/Contest";
import ProfileForm from "./pages/ProfileForm";
import PP from "./pages/PP";
import UpdatePassword from "./pages/UpdatePassword";
import AuthRoute from './components/AuthRoute';

export const router = createBrowserRouter([
    { path: "/", element: <Start /> },
    {
        path: "/signup",
        element: (
            <AuthRoute>
                <SignUp />
            </AuthRoute>
        )
    },
    {
        path: "/login",
        element: (
            <AuthRoute>
                <Login />
            </AuthRoute>
        )
    },
    {
        path: "/update-password",
        element: (
            <PrivateRoute>
                <UpdatePassword />
            </PrivateRoute>
        )
    },
    {
        path: "/profile",
        element: (
            
                <Profile />
           
        )
    },
    {
        path: "/dashboard",
        element: (
          
                <Dashboard />
            
        )
    },
    {
        path: "/contest",
        element: (
           
                <Contest />
        )
    },
    {
        path: "/leetcode",
        element: (
            
                <LeetcodePage />
           
        )
    },
    {
        path: "/codechef",
        element: (
            
                <CodechefPage />
           
        )
    },
    {
        path: "/codeforces",
        element: (
           
                <CodeforcesPage />
            
        )
    },
    {
        path: "/profileform",
        element: (
            <PrivateRoute>
                <ProfileForm />
            </PrivateRoute>
        )
    },
]);