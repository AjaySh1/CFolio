import { createContext, useContext, useState } from 'react';
import { UserAuth } from './AuthContext'; // Import AuthContext

const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setUser } = UserAuth(); // Access the AuthContext's setUser function

  const fetchProfile = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      setProfileData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userId, updatedData) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      const updatedProfile = await response.json();
      setProfileData(updatedProfile); // Update profileData in UserProfileContext
      setUser(updatedProfile.user); // Update user in AuthContext
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserProfileContext.Provider
      value={{
        profileData,
        setProfileData,
        loading,
        error,
        fetchProfile,
        updateProfile,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => useContext(UserProfileContext);