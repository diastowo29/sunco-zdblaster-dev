module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MbTemplates', {
    id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    integrationId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'integration_id'
    },
    category: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    language: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    header: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    footer: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    buttons: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'mb-templates',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "mb-templates_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
