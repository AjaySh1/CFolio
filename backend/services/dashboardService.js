const leetcodeService = require('./leetcodeService');
const codeforcesService = require('./codeforcesService');
const codechefService = require('./codechefService');
const userService = require('./userService'); // For getting usernames

class DashboardService {
  // Fetch live data from platforms and return in frontend-compatible format
  static async getDashboardData(userId) {
    // Get user's platform usernames from userService
    const userProfile = await userService.getProfile(userId);

    // LeetCode
    let leetcodeStats = {
      leetcode_total: 0,
      leetcode_easy: 0,
      leetcode_medium: 0,
      leetcode_hard: 0
    };
    let leetcodeContest = {
      leetcode_recent_contest_rating: null,
      leetcode_max_contest_rating: null
    };
    if (userProfile && userProfile.leetcode_username) {
      try {
        const lcData = await leetcodeService.fetchUserComprehensiveData(userProfile.leetcode_username);
        leetcodeStats.leetcode_total = lcData.totalSolved || 0;
        leetcodeStats.leetcode_easy = lcData.easySolved || 0;
        leetcodeStats.leetcode_medium = lcData.mediumSolved || 0;
        leetcodeStats.leetcode_hard = lcData.hardSolved || 0;
        leetcodeContest.leetcode_recent_contest_rating = lcData.contestRating?.recent || null;
        leetcodeContest.leetcode_max_contest_rating = lcData.contestRating?.max || null;
      } catch (e) {}
    }

    // Codeforces
    let codeforcesStats = { codeforces_total: 0 };
    let codeforcesContest = {
      codeforces_recent_contest_rating: null,
      codeforces_max_contest_rating: null
    };
    if (userProfile && userProfile.codeforces_username) {
      try {
        const submissions = await codeforcesService.getUserSubmissions(userProfile.codeforces_username);
        const solvedSet = new Set();
        submissions.forEach(sub => {
          if (sub.verdict === "OK" && sub.problem && sub.problem.contestId && sub.problem.index) {
            solvedSet.add(`${sub.problem.contestId}-${sub.problem.index}`);
          }
        });
        codeforcesStats.codeforces_total = solvedSet.size;

        const userInfo = await codeforcesService.getUserInfo(userProfile.codeforces_username);
        codeforcesContest.codeforces_recent_contest_rating = userInfo.rating || null;
        codeforcesContest.codeforces_max_contest_rating = userInfo.maxRating || null;
      } catch (e) {}
    }

    // Codechef
    let codechefStats = { codechef_total: 0 };
    let codechefContest = {
      codechef_stars: null,
      codechef_recent_contest_rating: null,
      codechef_max_contest_rating: null
    };
    if (userProfile && userProfile.codechef_username) {
      try {
        const ccData = await codechefService.extractProfileData(userProfile.codechef_username);
        codechefStats.codechef_total = ccData.problemsSolved || 0;
        codechefContest.codechef_stars = ccData.stars || null;
        codechefContest.codechef_recent_contest_rating = parseInt(ccData.rating) || null;
        codechefContest.codechef_max_contest_rating = ccData.highestRating || null;
      } catch (e) {}
    }

    // Return in the format expected by your frontend
    return {
      total_questions: [
        {
          ...leetcodeStats,
          ...codeforcesStats,
          ...codechefStats
        }
      ],
      contest_ranking_info: [
        {
          ...leetcodeContest,
          ...codeforcesContest,
          ...codechefContest
        }
      ]
    };
  }
}

module.exports = DashboardService;