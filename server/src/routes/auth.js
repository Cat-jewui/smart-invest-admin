const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 관리자 찾기
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    // 비밀번호 확인
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    // 활성 상태 확인
    if (!admin.isActive) {
      return res.status(403).json({ error: '비활성화된 계정입니다.' });
    }

    // 마지막 로그인 시간 업데이트
    await admin.update({ lastLoginAt: new Date() });

    // JWT 토큰 생성
    const token = jwt.sign(
      { 
        id: admin.id, 
        email: admin.email, 
        name: admin.name,
        role: admin.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: '로그인 중 오류가 발생했습니다.' });
  }
});

// 최초 관리자 계정 생성 (개발용)
router.post('/init', async (req, res) => {
  try {
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
    res.status(500).json({ error: '계정 생성 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
