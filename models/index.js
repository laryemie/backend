import { Sequelize } from 'sequelize';
import userModel from './User.js';

const sequelize = new Sequelize('job_skill_db', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql',
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = userModel(sequelize, Sequelize);

export default db;
