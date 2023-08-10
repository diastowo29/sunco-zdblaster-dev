const dbConfig = require("../config/db.config");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
      },
      keepAlive: true,
  },      
  ssl: true,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.histories = require("./mb_histories")(sequelize, Sequelize);
db.templates = require("./mb_templates")(sequelize, Sequelize);
db.job = require("./mb_job_schedules")(sequelize, Sequelize);

module.exports = db;