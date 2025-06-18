const User = require('../models/User');

class userService {
  // Update or create a user profile by id
  static async updateProfile(id, profileData) {
    const user = await User.findByIdAndUpdate(
      id,
      { ...profileData, updated_at: new Date() },
      { upsert: true, new: true }
    );
    return user;
  }

  // Get a user profile by id
  static async getProfile(id) {
    return User.findById(id, '-password');
  }
}

module.exports = userService;