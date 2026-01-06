module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define('Member', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING(20)
    },
    grade: {
      type: DataTypes.STRING(20),
      defaultValue: 'STANDARD',
      comment: '회원 등급 (STANDARD, DELUXE, PREMIUM)',
      validate: {
        isIn: [['STANDARD', 'DELUXE', 'PREMIUM']]
      }
    },
    kakaoId: {
      type: DataTypes.STRING(100),
      comment: '카카오 ID (메시지 발송용)'
    },
    memo: {
      type: DataTypes.TEXT,
      comment: '관리자 메모'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'members',
    timestamps: true,
    underscored: true
  });

  return Member;
};
