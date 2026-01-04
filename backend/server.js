require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const redis = require('redis');
const path = require('path');
const bodyParser = require('body-parser');


//const { globalLimiter, authLimiter } = require('./middleware/rateLimiters');

// Import routes
//const authRoutes = require('./routes/auth');
const importRoutes = require('./routes/import');
const recruitingRoutes = require('./routes/recruiting');

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

// --- Redis Client Setup ---
const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('connect', () => console.log('Connected to Redis!'));
redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
    await redisClient.connect();
})();

// Middleware to make redisClient available to routes/controllers
app.use((req, res, next) => {
    req.redisClient = redisClient;
    next();
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/files', express.static(path.join(__dirname, 'files')));

app.set('trust proxy', 1);

// Apply rate limiters
//app.use(globalLimiter); 
//app.use('/api/auth', authLimiter);

// API Routes
//app.use('/api/auth', authRoutes);
app.use('/api/import', importRoutes);
app.use('/api/recruiting', recruitingRoutes);



// A simple root route to check if the server is up
app.get('/', (req, res) => {
  res.send('Funnel Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});