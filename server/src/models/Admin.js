module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    role: {
      type: DataTypes.STRING(20),
      comment: '권한 (SUPER_ADMIN, ADMIN)',
      validate: {
        isIn: [['SUPER_ADMIN', 'ADMIN']]
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    lastLoginAt: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'admins',
    timestamps: true,
    underscored: true
  });

  return Admin;
};
