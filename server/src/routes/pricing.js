const express = require('express');
const router = express.Router();
const { Package } = require('../models');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// 패키지 목록 조회
router.get('/', async (req, res) => {
  try {
    const packages = await Package.findAll({
      order: [['displayOrder', 'ASC']]
    });
    res.json(packages);
  } catch (error) {
    console.error('Get packages error:', error);
    res.status(500).json({ error: '패키지 조회 중 오류가 발생했습니다.' });
  }
});

// 패키지 수정
router.put('/:id', async (req, res) => {
  try {
    const { name, price, features, workDays, revisions, badge } = req.body;
    
    const pkg = await Package.findByPk(req.params.id);
    if (!pkg) {
      return res.status(404).json({ error: '패키지를 찾을 수 없습니다.' });
    }

    await pkg.update({ name, price, features, workDays, revisions, badge });
    res.json(pkg);
  } catch (error) {
    console.error('Update package error:', error);
    res.status(500).json({ error: '패키지 수정 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
