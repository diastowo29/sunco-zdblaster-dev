var DataTypes = require("sequelize").DataTypes;
var _MbHistories = require("./mb_histories");
var _MbJobSchedules = require("./mb_job_schedules");
var _MbTemplates = require("./mb_templates");
var _MbTransactions = require("./mb_transactions");
var _MbUsers = require("./mb_users");

function initModels(sequelize) {
  var MbHistories = _MbHistories(sequelize, DataTypes);
  var MbJobSchedules = _MbJobSchedules(sequelize, DataTypes);
  var MbTemplates = _MbTemplates(sequelize, DataTypes);
  var MbTransactions = _MbTransactions(sequelize, DataTypes);
  var MbUsers = _MbUsers(sequelize, DataTypes);


  return {
    MbHistories,
    MbJobSchedules,
    MbTemplates,
    MbTransactions,
    MbUsers,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
