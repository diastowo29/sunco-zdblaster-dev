const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MbUsers', {
    id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    fname: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    lname: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    suncoAccountSecret: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'sunco_account_secret'
    },
    suncoAccountId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'sunco_account_id'
    },
    suncoAppId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'sunco_app_id'
    },
    zdSubdomain: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'zd_subdomain'
    }
  }, {
    sequelize,
    tableName: 'mb-users',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "mb-users_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
