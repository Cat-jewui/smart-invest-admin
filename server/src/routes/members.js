const express = require('express');
const router = express.Router();
const { Member, Payment } = require('../models');
const authMiddleware = require('../middleware/auth');
const axios = require('axios');

router.use(authMiddleware);

// 회원 목록 조회
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, grade } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (grade) {
      where.grade = grade;
    }

    const { rows: members, count } = await Member.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      include: [{
        model: Payment,
        attributes: ['packageName', 'amount', 'paidAt']
      }]
    });

    res.json({
      members,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ error: '회원 조회 중 오류가 발생했습니다.' });
  }
});

// 회원 상세 조회
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id, {
      include: [{
        model: Payment,
        order: [['paidAt', 'DESC']]
      }]
    });

    if (!member) {
      return res.status(404).json({ error: '회원을 찾을 수 없습니다.' });
    }

    res.json(member);
  } catch (error) {
    console.error('Get member error:', error);
    res.status(500).json({ error: '회원 조회 중 오류가 발생했습니다.' });
  }
});

// 회원 정보 수정
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, grade, memo, kakaoId } = req.body;
    
    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ error: '회원을 찾을 수 없습니다.' });
    }

    await member.update({
      name,
      email,
      phone,
      grade,
      memo,
      kakaoId
    });

    res.json(member);
  } catch (error) {
    console.error('Update member error:', error);
    res.status(500).json({ error: '회원 수정 중 오류가 발생했습니다.' });
  }
});

// 카카오 메시지 발송
router.post('/send-kakao', async (req, res) => {
  try {
    const { memberIds, message } = req.body;

    // 실제 카카오 API 호출 (여기서는 예시)
    // const result = await axios.post('https://kapi.kakao.com/v2/api/talk/memo/default/send', {
    //   template_object: {
    //     object_type: 'text',
    //     text: message,
    //     link: {
    //       web_url: 'https://your-website.com',
    //       mobile_web_url: 'https://your-website.com'
    //     }
    //   }
    // }, {
    //   headers: {
    //     'Authorization': `Bearer ${process.env.KAKAO_REST_API_KEY}`
    //   }
    // });

    // 임시 응답
    res.json({ 
      success: true, 
      message: `${memberIds.length}명에게 카카오 메시지를 발송했습니다.` 
    });
  } catch (error) {
    console.error('Send Kakao error:', error);
    res.status(500).json({ error: '메시지 발송 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
