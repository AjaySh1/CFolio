// filepath: c:\Users\ajays\Desktop\cptracker\cp-tracker\frontend\src\context\AuthContext.jsx
import { createContext, useContext } from "react";

const AuthContext = createContext({
  session: { user: { id: "local-user", email: "local@dev.com" } },
  loading: false,
  signUpNewUser: async () => {},
  signInUser: async () => ({ data: null, error: null }),
  signInWithGoogle: async () => ({ data: null, error: null }),
  signOut: async () => {},
  resetPassword: async () => ({ data: null, error: null }),
  updatePassword: async () => ({ data: null, error: null }),
});

export const AuthContextProvider = ({ children }) => (
  <AuthContext.Provider value={{
    session: { user: { id: "local-user", email: "local@dev.com" } },
    loading: false,
    signUpNewUser: async () => {},
    signInUser: async () => ({ data: null, error: null }),
    signInWithGoogle: async () => ({ data: null, error: null }),
    signOut: async () => {},
    resetPassword: async () => ({ data: null, error: null }),
    updatePassword: async () => ({ data: null, error: null }),
  }}>
    {children}
  </AuthContext.Provider>
);

export const UserAuth = () => useContext(AuthContext);