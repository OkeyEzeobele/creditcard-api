module.exports = (sequelize, DataTypes) => {
  const topup = sequelize.define('topup', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['created', 'sent', 'completed'],
    },
    amount: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cardId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {});
  // eslint-disable-next-line no-unused-vars
  topup.associate = (models) => {
    // associations can be defined here
  };
  return topup;
};
