const SequelizeAuto = require('sequelize-auto');
const Sequelize = require('sequelize');
require('dotenv').config();

var sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect:  'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
        keepAlive: true,
    },      
    ssl: true
});
const options = { caseFile: 'l', caseModel: 'p', caseProp: 'c' };

const auto = new SequelizeAuto(sequelize, null, null, options);
auto.run();
// console.log(process.env.DATABASE_URL)