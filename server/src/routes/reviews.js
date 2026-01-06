const express = require('express');
const router = express.Router();
const { Review } = require('../models');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: ['Member'],
      order: [['created_at', 'DESC']]
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: '리뷰 조회 중 오류가 발생했습니다.' });
  }
});

router.put('/:id/reply', async (req, res) => {
  try {
    const { adminReply } = req.body;
    const review = await Review.findByPk(req.params.id);
    
    if (!review) {
      return res.status(404).json({ error: '리뷰를 찾을 수 없습니다.' });
    }

    await review.update({ adminReply, repliedAt: new Date() });
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: '답변 등록 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
