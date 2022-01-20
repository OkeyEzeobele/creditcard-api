
module.exports = (sequelize, DataTypes) => {
  const document = sequelize.define('document', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: [
        'statement',
        'license',
        'passport',
        'selfie',
        'personalIdCard',
        'jobIdCard',
      ],
    },
    data: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {});
  // eslint-disable-next-line no-unused-vars
  document.associate = (models) => {
    // associations can be defined here
    document.belongsTo(models.user, {
      foreignKey: 'userId',
      as: 'user',
    });
  };
  return document;
};
