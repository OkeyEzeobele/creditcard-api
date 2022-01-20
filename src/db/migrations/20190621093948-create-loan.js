module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('loans', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    amount: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ['created', 'pending', 'rejected', 'approved', 'completed'],
    },
    disbursed: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    paymentType: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    bankCode: {
      type: Sequelize.STRING,
    },
    accountNumber: {
      type: Sequelize.STRING,
    },
    cardNumber: {
      type: Sequelize.STRING,
    },
    tenure: {
      type: Sequelize.INTEGER,
    },
    repaymentId: {
      type: Sequelize.INTEGER,
    },
    repaymentAmount: {
      type: Sequelize.STRING,
    },
    planToken: {
      type: Sequelize.STRING,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => queryInterface.dropTable('loans'),
};
