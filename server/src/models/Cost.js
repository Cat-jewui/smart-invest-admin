module.exports = (sequelize, DataTypes) => {
  const Cost = sequelize.define('Cost', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },    
    category: {
      type: DataTypes.STRING(20),
      comment: '비용 카테고리 (PAYMENT_FEE, KMONG_FEE, SERVER, DOMAIN, MARKETING, ETC)',
      validate: {
        isIn: [['PAYMENT_FEE', 'KMONG_FEE', 'SERVER', 'DOMAIN', 'MARKETING', 'ETC']]
      },
      allowNull: false
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    isRecurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: '정기 비용 여부'
    }
  }, {
    tableName: 'costs',
    timestamps: true,
    underscored: true
  });

  return Cost;
};
