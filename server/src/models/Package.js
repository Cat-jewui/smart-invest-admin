module.exports = (sequelize, DataTypes) => {
  const Package = sequelize.define('Package', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'STANDARD, DELUXE, PREMIUM'
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    features: {
      type: DataTypes.JSONB,
      allowNull: false,
      comment: '기능 목록 배열'
    },
    workDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '작업 일수'
    },
    revisions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '수정 횟수'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '표시 순서'
    },
    badge: {
      type: DataTypes.STRING(20),
      comment: '배지 텍스트 (예: 추천, 인기)'
    }
  }, {
    tableName: 'packages',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['name'],
        name: 'packages_name_unique'
      }
    ]
  });

  return Package;
};
