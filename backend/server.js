require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./db');

// Connect to the database
connectDB();

// Import routes
const leetcodeRoutes = require('./routes/leetcodeRoutes');
const codechefRoutes = require('./routes/codechefRoutes');
const codeforcesRoutes = require('./routes/codeforcesRoutes');
const userRoutes = require('./routes/userRoutes');
const contestRoutes = require('./routes/contestRoutes');
const heatmapRoutes = require('./routes/heatmapRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
// app.use(helmet());
// app.use(cors({
//   origin: process.env.NODE_ENV === 'production' 
//     ? process.env.FRONTEND_PROD_URL 
//     : 'http://localhost:5173',
//   credentials: true,
//   exposedHeaders: ['Authorization']
// }));

// Body parser middleware
app.use(express.json());

// Define routes
app.use('/api/leetcode', leetcodeRoutes);
app.use('/api/codechef', codechefRoutes);
app.use('/api/codeforces', codeforcesRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/dash', heatmapRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', profileRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    environment: process.env.NODE_ENV || 'development' 
  });
});

// Fallback route for undefined endpoints
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? { message: 'Internal server error' }
      : { message: err.message, stack: err.stack }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = app;