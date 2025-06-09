import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Cpu, HardDrive, User, Mail, Check, X, Save, Edit, LogOut, Loader2, MapPin, Github, Linkedin, BookOpen } from 'lucide-react';
import Header from '../components/Header';
import { MdVerified } from "react-icons/md";
import { useUserProfile } from '../context/UserProfileContext';

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

export default function Profile() {
  // Always fallback to {} if context is null
  const { profileData: contextProfileDataRaw, setProfileData: setProfileContext } = useUserProfile();
  const contextProfileData = contextProfileDataRaw || {};

  // Use contextProfileData as initial state
  const [profileData, setProfileData] = useState({
    name: contextProfileData.name || 'Local User',
    email: contextProfileData.email || 'local@dev.com',
    gender: contextProfileData.gender || '',
    location: contextProfileData.location || '',
    education: contextProfileData.education || '',
    github: contextProfileData.github || '',
    linkedin: contextProfileData.linkedin || '',
    codeforces_username: contextProfileData.codeforces_username || '',
    codechef_username: contextProfileData.codechef_username || '',
    leetcode_username: contextProfileData.leetcode_username || '',
  });
  const [initialData, setInitialData] = useState({ ...profileData });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editableFields, setEditableFields] = useState({
    name: false,
    email: false,
    gender: false,
    location: false,
    education: false,
    github: false,
    linkedin: false,
    codeforces_username: false,
    codechef_username: false,
    leetcode_username: false,
  });

  // Load profile data from backend on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/users/${contextProfileData.email || profileData.email}`);
        if (res.ok) {
          const data = await res.json();
          setProfileData({
            name: data.name || 'Local User',
            email: data.email || 'local@dev.com',
            gender: data.gender || '',
            location: data.location || '',
            education: data.education || '',
            github: data.github || '',
            linkedin: data.linkedin || '',
            codeforces_username: data.codeforces_username || '',
            codechef_username: data.codechef_username || '',
            leetcode_username: data.leetcode_username || '',
          });
          setInitialData({
            name: data.name || 'Local User',
            email: data.email || 'local@dev.com',
            gender: data.gender || '',
            location: data.location || '',
            education: data.education || '',
            github: data.github || '',
            linkedin: data.linkedin || '',
            codeforces_username: data.codeforces_username || '',
            codechef_username: data.codechef_username || '',
            leetcode_username: data.leetcode_username || '',
          });
          setProfileContext(data); // Update context on load
        }
      } catch (err) {
        // Ignore if not found
      }
    };
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleEdit = (field) => {
    setEditableFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const cancelEdit = () => {
    setProfileData(initialData);
    setEditableFields({
      name: false,
      email: false,
      gender: false,
      location: false,
      education: false,
      github: false,
      linkedin: false,
      codeforces_username: false,
      codechef_username: false,
      leetcode_username: false,
    });
    setError(null);
    setSuccess(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      if (!profileData.name?.trim()) {
        throw new Error('Name cannot be empty');
      }
      // Save to backend (PUT request)
      const res = await fetch(`${API_BASE}/api/users/${profileData.email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save profile');
      }
      setInitialData({ ...profileData });
      setSuccess('Profile updated!');
      setEditableFields({
        name: false,
        email: false,
        gender: false,
        location: false,
        education: false,
        github: false,
        linkedin: false,
        codeforces_username: false,
        codechef_username: false,
        leetcode_username: false,
      });
      setProfileContext(profileData); // Update context after save
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      setProfileContext({}); // Clear context on logout, never set to null
      window.location.href = '/';
    }
  };

  const hasChanges = JSON.stringify(profileData) !== JSON.stringify(initialData);

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
                <div className="flex items-center">
                  <X className="h-5 w-5 mr-2" />
                  {error}
                </div>
              </motion.div>
            )}
            {success && (
              <motion.div
                className="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-md"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center">
                  <Check className="h-5 w-5 mr-2" />
                  {success}
                </div>
              </motion.div>
            )}

            <motion.form className="space-y-6" onSubmit={handleSave} variants={containerVariants}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information Column */}
                <div className="space-y-6">
                  {/* Name */}
                  <motion.div variants={itemVariants}>
                    <div className="flex justify-between items-center">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Name
                      </label>
                      <button
                        type="button"
                        onClick={() => toggleEdit('name')}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        {editableFields.name ? <X className="h-4 w-4" onClick={cancelEdit} /> : <Edit className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={profileData.name || ""}
                        onChange={handleChange}
                        readOnly={!editableFields.name}
                        className={`block w-full pl-10 pr-3 py-2 border rounded-md ${
                          editableFields.name
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed border-transparent'
                        } sm:text-sm`}
                        placeholder="Name"
                      />
                    </div>
                  </motion.div>
                  {/* Email */}
                  <motion.div variants={itemVariants}>
                    <div className="flex justify-between items-center">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                      </label>
                      <button
                        type="button"
                        onClick={() => toggleEdit('email')}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        {editableFields.email ? <X className="h-4 w-4" onClick={cancelEdit} /> : <Edit className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email || ""}
                        onChange={handleChange}
                        readOnly={!editableFields.email}
                        className={`block w-full pl-10 pr-3 py-2 border rounded-md ${
                          editableFields.email
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed border-transparent'
                        } sm:text-sm`}
                        placeholder="Email"
                      />
                    </div>
                  </motion.div>
                  {/* Gender */}
                  <motion.div variants={itemVariants}>
                    <div className="flex justify-between items-center">
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Gender
                      </label>
                      <button
                        type="button"
                        onClick={() => toggleEdit('gender')}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        {editableFields.gender ? <X className="h-4 w-4" onClick={cancelEdit} /> : <Edit className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        id="gender"
                        name="gender"
                        type="text"
                        value={profileData.gender || ""}
                        onChange={handleChange}
                        readOnly={!editableFields.gender}
                        className={`block w-full pr-3 py-2 border rounded-md ${
                          editableFields.gender
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed border-transparent'
                        } sm:text-sm`}
                        placeholder="Gender"
                      />
                    </div>
                  </motion.div>
                  {/* Location */}
                  <motion.div variants={itemVariants}>
                    <div className="flex justify-between items-center">
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Location
                      </label>
                      <button
                        type="button"
                        onClick={() => toggleEdit('location')}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        {editableFields.location ? <X className="h-4 w-4" onClick={cancelEdit} /> : <Edit className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="location"
                        name="location"
                        type="text"
                        value={profileData.location || ""}
                        onChange={handleChange}
                        readOnly={!editableFields.location}
                        className={`block w-full pl-10 pr-3 py-2 border rounded-md ${
                          editableFields.location
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed border-transparent'
                        } sm:text-sm`}
                        placeholder="Location"
                      />
                    </div>
                  </motion.div>
                  {/* Education */}
                  <motion.div variants={itemVariants}>
                    <div className="flex justify-between items-center">
                      <label htmlFor="education" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Education
                      </label>
                      <button
                        type="button"
                        onClick={() => toggleEdit('education')}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        {editableFields.education ? <X className="h-4 w-4" onClick={cancelEdit} /> : <Edit className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BookOpen className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="education"
                        name="education"
                        type="text"
                        value={profileData.education || ""}
                        onChange={handleChange}
                        readOnly={!editableFields.education}
                        className={`block w-full pl-10 pr-3 py-2 border rounded-md ${
                          editableFields.education
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed border-transparent'
                        } sm:text-sm`}
                        placeholder="Education"
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Social & Coding Profiles Column */}
                <div className="space-y-6">
                  {/* Github */}
                  <motion.div variants={itemVariants}>
                    <div className="flex justify-between items-center">
                      <label htmlFor="github" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Github
                      </label>
                      <button
                        type="button"
                        onClick={() => toggleEdit('github')}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        {editableFields.github ? <X className="h-4 w-4" onClick={cancelEdit} /> : <Edit className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Github className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="github"
                        name="github"
                        type="text"
                        value={profileData.github || ""}
                        onChange={handleChange}
                        readOnly={!editableFields.github}
                        className={`block w-full pl-10 pr-3 py-2 border rounded-md ${
                          editableFields.github
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed border-transparent'
                        } sm:text-sm`}
                        placeholder="Github"
                      />
                    </div>
                  </motion.div>
                  {/* Linkedin */}
                  <motion.div variants={itemVariants}>
                    <div className="flex justify-between items-center">
                      <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Linkedin
                      </label>
                      <button
                        type="button"
                        onClick={() => toggleEdit('linkedin')}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        {editableFields.linkedin ? <X className="h-4 w-4" onClick={cancelEdit} /> : <Edit className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Linkedin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="linkedin"
                        name="linkedin"
                        type="text"
                        value={profileData.linkedin || ""}
                        onChange={handleChange}
                        readOnly={!editableFields.linkedin}
                        className={`block w-full pl-10 pr-3 py-2 border rounded-md ${
                          editableFields.linkedin
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed border-transparent'
                        } sm:text-sm`}
                        placeholder="Linkedin"
                      />
                    </div>
                  </motion.div>
                  {/* Coding Usernames */}
                  {[
                    { id: 'codeforces_username', icon: Code, label: 'Codeforces Username', maxLength: 24 },
                    { id: 'codechef_username', icon: Cpu, label: 'CodeChef Username', maxLength: 24 },
                    { id: 'leetcode_username', icon: HardDrive, label: 'LeetCode Username', maxLength: 24 },
                  ].map(({ id, icon: Icon, label, maxLength }) => (
                    <motion.div key={id} variants={itemVariants}>
                      <div className="flex justify-between items-center">
                        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {label}
                        </label>
                        <button
                          type="button"
                          onClick={() => toggleEdit(id)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          {editableFields[id] ? (
                            <X className="h-4 w-4" onClick={cancelEdit} />
                          ) : (
                            <Edit className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Icon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id={id}
                          name={id}
                          type="text"
                          value={profileData[id] || ""}
                          onChange={handleChange}
                          readOnly={!editableFields[id]}
                          maxLength={maxLength}
                          className={`block w-full pl-10 pr-3 py-2 border rounded-md ${
                            editableFields[id]
                              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed border-transparent'
                          } sm:text-sm`}
                          placeholder={`${label}`}
                        />
                      </div>
                      {editableFields[id] && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {profileData[id]?.length || 0}/{maxLength} characters
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
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
                <div className="flex space-x-2">
                  {hasChanges && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={!hasChanges || isSaving}
                    className={`inline-flex items-center px-4 py-2 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      !hasChanges || isSaving
                        ? 'bg-gray-400 cursor-not-allowed focus:ring-gray-500'
                        : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                    } transition-colors`}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}