import { createContext, useContext, useState } from 'react';

const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
  // Provide initial mock profile data to avoid null errors
  const [profileData, setProfileData] = useState({
    name: 'Local User',
    email: 'local@dev.com',
    gender: '',
    location: '',
    education: '',
    github: '',
    linkedin: '',
    codeforces_username: '',
    codechef_username: '',
    leetcode_username: '',
  });
  const [loading] = useState(false);
  const [error] = useState(null);

  return (
    <UserProfileContext.Provider value={{ profileData, setProfileData, loading, error }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => useContext(UserProfileContext);