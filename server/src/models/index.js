const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  family: 4,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.Admin = require('./Admin')(sequelize, Sequelize);
db.Member = require('./Member')(sequelize, Sequelize);
db.Payment = require('./Payment')(sequelize, Sequelize);
db.Review = require('./Review')(sequelize, Sequelize);
db.ChatMessage = require('./ChatMessage')(sequelize, Sequelize);
db.Cost = require('./Cost')(sequelize, Sequelize);
db.Package = require('./Package')(sequelize, Sequelize);

// Associations
// Payment - Member
db.Payment.belongsTo(db.Member, { foreignKey: 'memberId' });
db.Member.hasMany(db.Payment, { foreignKey: 'memberId' });

// Review - Member
db.Review.belongsTo(db.Member, { foreignKey: 'memberId' });
db.Member.hasMany(db.Review, { foreignKey: 'memberId' });

module.exports = db;
