import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, MapPin, BookOpen, Github, Linkedin, Code, Cpu, HardDrive, Save, LogOut } from 'lucide-react';
import Header from '../components/Header';
import { UserAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.3, staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'https://cfolio.onrender.com';

export default function Profile() {
  const { user, setUser } = UserAuth(); // Retrieve user and setUser from context
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    github: user?.github || '',
    linkedin: user?.linkedin || '',
    codeforces_username: user?.codeforces_username || '',
    codechef_username: user?.codechef_username || '',
    leetcode_username: user?.leetcode_username || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Load profile data from backend on mount
  const userId = user?._id || user?.id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!userId) {
          throw new Error('User ID is undefined');
        }
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setProfileData({
            name: data.name || '',
            email: data.email || '',
            github: data.github || '',
            linkedin: data.linkedin || '',
            codeforces_username: data.codeforces_username || '',
            codechef_username: data.codechef_username || '',
            leetcode_username: data.leetcode_username || '',
          });
        } else {
          throw new Error('Failed to fetch profile data');
        }
      } catch (err) {
        console.error('Error fetching profile:', err.message);
        setError(err.message);
      }
    };
    fetchProfile();
    // eslint-disable-next-line
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      // Exclude email from the request payload
      const { email, ...updateData } = profileData;
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save profile');
      }

      const updatedProfile = await res.json();
      setSuccess('Profile updated successfully!');
      setUser(updatedProfile.user || updatedProfile);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
  };

  return (
    <div className="pt-28 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <Header />
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2
            className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            My Profile
          </motion.h2>
        </div>

        <motion.div
          className="mt-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-lg rounded-lg">
            {error && (
              <motion.div
                className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-md"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                className="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-md"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {success}
              </motion.div>
            )}

            <motion.form className="space-y-6" onSubmit={handleSave} variants={containerVariants}>
              {/* Name */}
              <motion.div variants={itemVariants}>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={profileData.name}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white sm:text-sm"
                  placeholder="Your Name"
                />
              </motion.div>

              {/* Email */}
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white sm:text-sm"
                  placeholder="Your Email"
                  disabled
                />
              </motion.div>

              {/* Github */}
              <motion.div variants={itemVariants}>
                <label htmlFor="github" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Github
                </label>
                <input
                  id="github"
                  name="github"
                  type="text"
                  value={profileData.github}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white sm:text-sm"
                  placeholder="Github Profile URL"
                />
              </motion.div>

              {/* Linkedin */}
              <motion.div variants={itemVariants}>
                <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Linkedin
                </label>
                <input
                  id="linkedin"
                  name="linkedin"
                  type="text"
                  value={profileData.linkedin}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white sm:text-sm"
                  placeholder="Linkedin Profile URL"
                />
              </motion.div>

              {/* Codeforces */}
              <motion.div variants={itemVariants}>
                <label htmlFor="codeforces_username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Codeforces Username
                </label>
                <input
                  id="codeforces_username"
                  name="codeforces_username"
                  type="text"
                  value={profileData.codeforces_username}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white sm:text-sm"
                  placeholder="Codeforces Username"
                />
              </motion.div>

              {/* Codechef */}
              <motion.div variants={itemVariants}>
                <label htmlFor="codechef_username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Codechef Username
                </label>
                <input
                  id="codechef_username"
                  name="codechef_username"
                  type="text"
                  value={profileData.codechef_username}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white sm:text-sm"
                  placeholder="Codechef Username"
                />
              </motion.div>

              {/* Leetcode */}
              <motion.div variants={itemVariants}>
                <label htmlFor="leetcode_username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Leetcode Username
                </label>
                <input
                  id="leetcode_username"
                  name="leetcode_username"
                  type="text"
                  value={profileData.leetcode_username}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white sm:text-sm"
                  placeholder="Leetcode Username"
                />
              </motion.div>

              {/* Save and Logout Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700"
              >
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`inline-flex items-center px-4 py-2 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isSaving
                      ? 'bg-gray-400 cursor-not-allowed focus:ring-gray-500'
                      : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                  } transition-colors`}
                >
                  {isSaving ? (
                    <>
                      <Save className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </motion.div>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}