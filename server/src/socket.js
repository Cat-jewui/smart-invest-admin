const { ChatMessage } = require('./models');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('✅ Client connected:', socket.id);

    // 채팅방 입장
    socket.on('join_room', async (roomId) => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);

      // 이전 메시지 로드
      const messages = await ChatMessage.findAll({
        where: { roomId },
        order: [['created_at', 'ASC']],
        limit: 100
      });

      socket.emit('previous_messages', messages);
    });

    // 메시지 전송
    socket.on('send_message', async (data) => {
      const { roomId, senderType, senderName, message } = data;

      // DB에 저장
      const newMessage = await ChatMessage.create({
        roomId,
        senderType,
        senderName,
        message
      });

      // 방 전체에 브로드캐스트
      io.to(roomId).emit('new_message', newMessage);
    });

    // 메시지 읽음 처리
    socket.on('mark_read', async (roomId) => {
      await ChatMessage.update(
        { isRead: true, readAt: new Date() },
        { where: { roomId, senderType: 'USER', isRead: false } }
      );

      io.to(roomId).emit('messages_read', roomId);
    });

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
    });
  });
};
