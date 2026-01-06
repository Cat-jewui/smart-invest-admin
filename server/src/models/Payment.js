module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'members',
        key: 'id'
      }
    },
    packageName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'STANDARD, DELUXE, PREMIUM'
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    source: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '결제 출처 (KMONG, TOSS)',
      validate: {
        isIn: [['KMONG', 'TOSS']]
      }
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'PENDING',
      comment: '결제 상태 (PENDING, COMPLETED, FAILED, REFUNDED)',
      validate: {
        isIn: [['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']]
      }
    },
    orderId: {
      type: DataTypes.STRING(100),
      comment: '토스페이먼츠 주문번호'
    },
    paymentKey: {
      type: DataTypes.STRING(200),
      comment: '토스페이먼츠 결제키'
    },
    paidAt: {
      type: DataTypes.DATE
    },
    refundedAt: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'payments',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['order_id'],
        name: 'payments_orderid_unique'
      }
    ]
  });

  return Payment;
};
