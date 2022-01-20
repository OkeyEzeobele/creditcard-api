module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('billpayments', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    status: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ['created', 'failed', 'completed'],
    },
    amount: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    recepient: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    cardId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('billpayments'),
};
