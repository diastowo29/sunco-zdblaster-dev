module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MbHistories', {
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
    conversationId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'conversation_id'
    },
    messageId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'message_id'
    },
    endUserName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'end_user_name'
    },
    phoneNumber: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'phone_number'
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    deliverAt: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'deliver_at'
    },
    readAt: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'read_at'
    },
    detail: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'mb-histories',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "mb-histories_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
