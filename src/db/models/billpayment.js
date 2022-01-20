module.exports = (sequelize, DataTypes) => {
  const billpayment = sequelize.define('billpayment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['created', 'failed', 'pending', 'completed'],
    },
    amount: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recepient: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cardId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {});
  // eslint-disable-next-line no-unused-vars
  billpayment.associate = (models) => {
    // associations can be defined here
  };
  return billpayment;
};
