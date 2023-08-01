const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MbJobSchedules', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    appId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'app_id'
    },
    channelId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'channel_id'
    },
    channelName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'channel_name'
    },
    transactionId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'transaction_id'
    },
    zdAgent: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'zd_agent'
    },
    userCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'user_count'
    },
    sentData: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'sent_data'
    },
    scheduleDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'schedule_date'
    },
    scheduleHour: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'schedule_hour'
    },
    cookies: {
      type: DataTypes.JSON,
      allowNull: true
    },
    jobs: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'mb-job-schedules',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "mb-job-schedules_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
