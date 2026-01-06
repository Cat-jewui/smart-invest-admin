const express = require('express');
const router = express.Router();
const { ChatMessage, Member, sequelize } = require('../models');
const authMiddleware = require('../middleware/auth');

// 채팅 목록 조회
router.use(authMiddleware);

router.get('/rooms', async (req, res) => {
  try {
    // 최근 메시지 기준으로 방 목록 구성
    const messages = await ChatMessage.findAll({
      order: [['created_at', 'DESC']],
      limit: 1000
    });

    const map = new Map();

    for (const msg of messages) {
      const roomId = msg.roomId;
      if (!map.has(roomId)) {
        // first (latest) message for this room
        map.set(roomId, {
          id: roomId,
          userName: msg.senderType === 'USER' ? msg.senderName : `방 ${roomId}`,
          lastMessage: msg.message,
          updatedAt: msg.createdAt,
          unreadCount: 0
        });
      }
    }

    // Unread counts
    const unread = await ChatMessage.findAll({
      attributes: ['roomId', [sequelize.fn('COUNT', sequelize.col('id')), 'cnt']],
      where: { senderType: 'USER', isRead: false },
      group: ['roomId']
    });

    for (const u of unread) {
      const roomId = u.get('roomId');
      const cnt = parseInt(u.get('cnt')) || 0;
      if (map.has(roomId)) {
        map.get(roomId).unreadCount = cnt;
      } else {
        map.set(roomId, {
          id: roomId,
          userName: `방 ${roomId}`,
          lastMessage: '',
          updatedAt: new Date(),
          unreadCount: cnt
        });
      }
    }

    // Convert to array and sort by updatedAt desc
    const rooms = Array.from(map.values()).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    res.json({ rooms });
  } catch (error) {
    console.error('Get chat rooms error:', error);
    res.status(500).json({ error: '대화방 목록을 불러오는 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
