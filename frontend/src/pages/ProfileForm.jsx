import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Cpu, HardDrive, User, Check, X, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

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

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function ProfileForm() {
  const [formData, setFormData] = useState({
    name: '',
    codeforces: '',
    codechef: '',
    leetcode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Get the actual user from AuthContext
  const { user } = UserAuth();
  // Use user.id, user._id, or user.username as per your backend
  const userId = user?.id || user?._id || user?.username;

  // Debugging logs for `user` and `userId`
  useEffect(() => {
    console.log('User from AuthContext:', user); // Debugging log
    console.log('Derived userId:', userId); // Debugging log
  }, [user, userId]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        console.error('userId is undefined'); // Debugging log
        return;
      }
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE}/api/users/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        console.log('Fetched profile data:', data); // Debugging log
        setFormData({
          name: data.name || '',
          codeforces: data.codeforces_username || '',
          codechef: data.codechef_username || '',
          leetcode: data.leetcode_username || ''
        });
      } catch (err) {
        console.error('Error fetching profile:', err.message); // Debugging log
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
    // eslint-disable-next-line
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          codeforces_username: formData.codeforces,
          codechef_username: formData.codechef,
          leetcode_username: formData.leetcode
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error updating profile:', errorData); // Debugging log
        throw new Error(errorData.error || 'Failed to update profile');
      }

      console.log('Profile updated successfully'); // Debugging log
      setSuccess('Profile saved successfully!');
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err) {
      console.error('Error during profile update:', err.message); // Debugging log
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#fefcf9] to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col py-12 sm:px-6 lg:px-8">
      {/* Dark Mode Toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => {
            const html = document.documentElement;
            html.classList.toggle('dark');
            localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
          }}
          className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-3 py-1 rounded-md text-sm shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          Toggle Dark Mode
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <motion.h1 
            className="text-4xl font-bold text-blue-600 dark:text-blue-400"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Cfolio
          </motion.h1>
          <motion.h2 
            className="mt-2 text-xl font-semibold text-gray-800 dark:text-white"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Update Your Profile
          </motion.h2>
        </div>

        <motion.div 
          className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg border dark:border-gray-700 rounded-lg sm:px-10">
            
            {error && (
              <motion.div 
                className="mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-md"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center">
                  <X className="h-5 w-5 mr-2" />
                  {error}
                </div>
              </motion.div>
            )}
            {success && (
              <motion.div 
                className="mb-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-md"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center">
                  <Check className="h-5 w-5 mr-2" />
                  {success}
                </div>
              </motion.div>
            )}

            <motion.form className="space-y-6" onSubmit={handleSubmit} variants={containerVariants}>
              <motion.div variants={itemVariants}>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white sm:text-sm transition-colors duration-200"
                    placeholder="Your name"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Competitive Programming Profiles
                </h3>

                {/* Codeforces */}
                <div className="mb-4">
                  <label htmlFor="codeforces" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Codeforces
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Code className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="codeforces"
                      name="codeforces"
                      type="text"
                      value={formData.codeforces}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white sm:text-sm transition-colors duration-200"
                      placeholder="Codeforces username"
                    />
                  </div>
                </div>

                {/* CodeChef */}
                <div className="mb-4">
                  <label htmlFor="codechef" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    CodeChef
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Cpu className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="codechef"
                      name="codechef"
                      type="text"
                      value={formData.codechef}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white sm:text-sm transition-colors duration-200"
                      placeholder="CodeChef username"
                    />
                  </div>
                </div>

                {/* LeetCode */}
                <div className="mb-4">
                  <label htmlFor="leetcode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    LeetCode
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HardDrive className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="leetcode"
                      name="leetcode"
                      type="text"
                      value={formData.leetcode}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white sm:text-sm transition-colors duration-200"
                      placeholder="LeetCode username"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Profile
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