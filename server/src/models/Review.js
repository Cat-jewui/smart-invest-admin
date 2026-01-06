module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    memberId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'members',
        key: 'id'
      }
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    source: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '리뷰 출처 (KMONG, WEBSITE)',
      validate: {
        isIn: [['KMONG', 'WEBSITE']]
      }
    },
    adminReply: {
      type: DataTypes.TEXT,
      comment: '관리자 답변'
    },
    repliedAt: {
      type: DataTypes.DATE
    },
    isVisible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: '홈페이지 노출 여부'
    }
  }, {
    tableName: 'reviews',
    timestamps: true,
    underscored: true
  });

  return Review;
};
