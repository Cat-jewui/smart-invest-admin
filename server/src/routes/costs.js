const express = require('express');
const router = express.Router();
const { Cost } = require('../models');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = {};
    
    if (startDate && endDate) {
      where.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const costs = await Cost.findAll({
      where,
      order: [['date', 'DESC']]
    });

    const total = costs.reduce((sum, c) => sum + c.amount, 0);
    res.json({ costs, total });
  } catch (error) {
    res.status(500).json({ error: '비용 조회 중 오류가 발생했습니다.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const cost = await Cost.create(req.body);
    res.json(cost);
  } catch (error) {
    res.status(500).json({ error: '비용 등록 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
