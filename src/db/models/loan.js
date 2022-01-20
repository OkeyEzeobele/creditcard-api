module.exports = (sequelize, DataTypes) => {
  const loan = sequelize.define('loan', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['created', 'pending', 'rejected', 'approved', 'completed'],
    },
    disbursed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    paymentType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bankCode: {
      type: DataTypes.STRING,
    },
    accountNumber: {
      type: DataTypes.STRING,
    },
    cardNumber: {
      type: DataTypes.STRING,
    },
    tenure: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    repaymentId: {
      type: DataTypes.INTEGER,
    },
    repaymentAmount: {
      type: DataTypes.STRING,
    },
    planToken: {
      type: DataTypes.STRING,
    },
  }, {});
  // eslint-disable-next-line no-unused-vars
  loan.associate = (models) => {
    // associations can be defined here
  };
  return loan;
};
