// Simple in-memory user store for demo purposes
const users = {};

class userService {
  // Update or create a user profile by email
  static async updateProfile(email, profileData) {
    users[email] = { ...profileData, updated_at: new Date() };
    return users[email];
  }

  // Get a user profile by email
  static async getProfile(email) {
    return users[email] || null;
  }
}

module.exports = userService;