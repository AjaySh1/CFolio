import { createContext, useContext, useState,useEffect } from "react";

const API_BASE = import.meta.env.VITE_BACKEND_URL ;

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
   // 1. Try to load user from localStorage
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  // 2. Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const signUpNewUser = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: 'Ajay' }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }
      if (!data.user || !data.user.id || !data.user.email) {
        throw new Error('Invalid response from server');
      }
      setUser({ id: data.user.id, email: data.user.email, name: data.user.name || 'Ajay' });
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST' });
    } catch (e) {
      // ignore errors
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  const refreshUser = async (userId) => {
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE}/api/users/${userId}`);
    if (!res.ok) {
      throw new Error('Failed to fetch user data');
    }
    const data = await res.json();
    setUser(data.user || data); // Set only the `user` object
  } catch (error) {
    console.error('Error refreshing user:', error);
  } finally {
    setLoading(false);
  }
};

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUpNewUser,
        loginUser,
        logoutUser,
        setUser,
        refreshUser, // Expose refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function UserAuth() {
  return useContext(AuthContext);
}