module.exports = (sequelize, DataTypes) => {
  const ChatMessage = sequelize.define('ChatMessage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    roomId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      index: true,
      comment: '채팅방 ID (보통 memberId 또는 세션ID)'
    },
    senderType: {
      type: DataTypes.STRING(20),
      comment: '유저 타입 (USER, ADMIN)',
      validate: {
        isIn: [['USER', 'ADMIN']]
      },
      allowNull: false
    },
    senderName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    readAt: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'chat_messages',
    timestamps: true,
    underscored: true
  });

  return ChatMessage;
};
