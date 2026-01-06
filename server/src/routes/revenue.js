const express = require('express');
const router = express.Router();
const { Payment } = require('../models');
const { Op } = require('sequelize');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// 수익 조회
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate, source } = req.query;

    const where = { status: 'COMPLETED' };
    
    if (startDate && endDate) {
      where.paidAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    
    if (source) {
      where.source = source;
    }

    const payments = await Payment.findAll({
      where,
      order: [['paidAt', 'DESC']],
      include: ['Member']
    });

    const total = payments.reduce((sum, p) => sum + p.amount, 0);
    const tossTotal = payments.filter(p => p.source === 'TOSS').reduce((sum, p) => sum + p.amount, 0);
    const kmongTotal = payments.filter(p => p.source === 'KMONG').reduce((sum, p) => sum + p.amount, 0);

    res.json({
      payments,
      summary: {
        total,
        tossTotal,
        kmongTotal,
        count: payments.length
      }
    });
  } catch (error) {
    console.error('Get revenue error:', error);
    res.status(500).json({ error: '수익 조회 중 오류가 발생했습니다.' });
  }
});

// 크몽 수익 CSV 업로드
router.post('/kmong-upload', async (req, res) => {
  try {
    const { data } = req.body; // CSV 파싱된 데이터
    
    // CSV 데이터를 Payment 테이블에 저장
    const created = await Payment.bulkCreate(
      data.map(row => ({
        memberId: row.memberId,
        packageName: row.packageName,
        amount: row.amount,
        source: 'KMONG',
        status: 'COMPLETED',
        paidAt: new Date(row.paidAt)
      })),
      { ignoreDuplicates: true }
    );

    res.json({ 
      success: true, 
      count: created.length,
      message: `${created.length}건의 크몽 수익이 등록되었습니다.` 
    });
  } catch (error) {
    console.error('Upload Kmong error:', error);
    res.status(500).json({ error: '업로드 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
