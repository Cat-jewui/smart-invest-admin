const express = require('express');
const router = express.Router();
const { Member, Payment, Review, ChatMessage, Cost } = require('../models');
const { Op } = require('sequelize');
const authMiddleware = require('../middleware/auth');

// 모든 대시보드 API는 인증 필요
router.use(authMiddleware);

// 대시보드 통계 조회
router.get('/stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    // 오늘 방문자 수 (임시 - 실제로는 Analytics API 연동 필요)
    const todayVisitors = Math.floor(Math.random() * 100) + 50;

    // 현재 회원 수
    const totalMembers = await Member.count({
      where: { isActive: true }
    });

    // 이번달 누적 결제 수익
    const monthlyRevenue = await Payment.sum('amount', {
      where: {
        status: 'COMPLETED',
        paidAt: {
          [Op.gte]: thisMonthStart
        }
      }
    }) || 0;

    // 평균 리뷰 평점
    const avgRating = await Review.findOne({
      attributes: [
        [Review.sequelize.fn('AVG', Review.sequelize.col('rating')), 'avg']
      ],
      where: { isVisible: true }
    });

    // 미답변 문의
    const unansweredChats = await ChatMessage.count({
      where: {
        senderType: 'USER',
        isRead: false
      },
      distinct: true,
      col: 'room_id'
    });

    res.json({
      todayVisitors,
      totalMembers,
      monthlyRevenue,
      avgRating: avgRating?.get('avg') ? parseFloat(avgRating.get('avg')).toFixed(1) : '0.0',
      unansweredChats
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: '통계 조회 중 오류가 발생했습니다.' });
  }
});

// 일별 회원가입 수 (최근 15일)
router.get('/daily-signups', async (req, res) => {
  try {
    const days = 15;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const signups = await Member.findAll({
      attributes: [
        [Member.sequelize.fn('DATE', Member.sequelize.col('created_at')), 'date'],
        [Member.sequelize.fn('COUNT', Member.sequelize.col('id')), 'count']
      ],
      where: {
        createdAt: {
          [Op.gte]: startDate
        }
      },
      group: [Member.sequelize.fn('DATE', Member.sequelize.col('created_at'))],
      order: [[Member.sequelize.fn('DATE', Member.sequelize.col('created_at')), 'ASC']],
      raw: true
    });

    res.json(signups);
  } catch (error) {
    console.error('Daily signups error:', error);
    res.status(500).json({ error: '데이터 조회 중 오류가 발생했습니다.' });
  }
});

// 일별 결제 수익 (최근 15일)
router.get('/daily-revenue', async (req, res) => {
  try {
    const days = 15;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const revenue = await Payment.findAll({
      attributes: [
        [Payment.sequelize.fn('DATE', Payment.sequelize.col('paid_at')), 'date'],
        [Payment.sequelize.fn('SUM', Payment.sequelize.col('amount')), 'total'],
        [Payment.sequelize.fn('COUNT', Payment.sequelize.col('id')), 'count']
      ],
      where: {
        status: 'COMPLETED',
        paidAt: {
          [Op.gte]: startDate
        }
      },
      group: [Payment.sequelize.fn('DATE', Payment.sequelize.col('paid_at'))],
      order: [[Payment.sequelize.fn('DATE', Payment.sequelize.col('paid_at')), 'ASC']],
      raw: true
    });

    res.json(revenue);
  } catch (error) {
    console.error('Daily revenue error:', error);
    res.status(500).json({ error: '데이터 조회 중 오류가 발생했습니다.' });
  }
});

// 패키지별 판매 현황
router.get('/package-sales', async (req, res) => {
  try {
    const sales = await Payment.findAll({
      attributes: [
        'packageName',
        [Payment.sequelize.fn('COUNT', Payment.sequelize.col('id')), 'count'],
        [Payment.sequelize.fn('SUM', Payment.sequelize.col('amount')), 'total']
      ],
      where: {
        status: 'COMPLETED'
      },
      group: ['packageName'],
      raw: true
    });

    res.json(sales);
  } catch (error) {
    console.error('Package sales error:', error);
    res.status(500).json({ error: '데이터 조회 중 오류가 발생했습니다.' });
  }
});

// 크몽 vs 자체결제 비율
router.get('/revenue-source', async (req, res) => {
  try {
    const sources = await Payment.findAll({
      attributes: [
        'source',
        [Payment.sequelize.fn('COUNT', Payment.sequelize.col('id')), 'count'],
        [Payment.sequelize.fn('SUM', Payment.sequelize.col('amount')), 'total']
      ],
      where: {
        status: 'COMPLETED'
      },
      group: ['source'],
      raw: true
    });

    res.json(sources);
  } catch (error) {
    console.error('Revenue source error:', error);
    res.status(500).json({ error: '데이터 조회 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
