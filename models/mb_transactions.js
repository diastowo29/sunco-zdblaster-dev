const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MbTransactions', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    transactionId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'transaction_id'
    },
    integrationId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'integration_id'
    },
    channelName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'channel_name'
    },
    templateName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'template_name'
    },
    totalUser: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'total_user'
    },
    loginEmail: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'login_email'
    },
    zdAgent: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'zd_agent'
    }
  }, {
    sequelize,
    tableName: 'mb-transactions',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "mb-transactions_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
