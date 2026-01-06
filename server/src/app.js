require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Socket.IO 전역 설정
app.set('io', io);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/members', require('./routes/members'));
app.use('/api/revenue', require('./routes/revenue'));
app.use('/api/pricing', require('./routes/pricing'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/costs', require('./routes/costs'));
app.use('/api/chat', require('./routes/chat'));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test Route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Init Admin (DB 연결 없이도 작동하는 버전)
app.post('/api/auth/init-simple', async (req, res) => {
  try {
    const bcrypt = require('bcrypt');
    const { Admin } = require('./models');
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return res.status(400).json({ error: '이미 관리자 계정이 존재합니다.' });
    }

    const hashedPassword = await bcrypt.hash('admin1234', 10);
    const admin = await Admin.create({
      email: 'admin@smart-admin.com',
      password: hashedPassword,
      name: 'BMS개발자',
      role: 'SUPER_ADMIN'
    });

    res.json({
      message: '관리자 계정이 생성되었습니다.',
      email: 'admin@smart-admin.com',
      password: 'admin1234'
    });
  } catch (error) {
    console.error('Init error:', error);
    res.status(500).json({
      error: '계정 생성 중 오류가 발생했습니다.',
      details: error.message
    });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Socket.IO Connection
require('./socket')(io);

// Database Connection
const db = require('./models');
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Database connected');
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
  });

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});

module.exports = { app, io };
