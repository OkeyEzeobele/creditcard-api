module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('transfers', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    status: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ['created', 'sent', 'failed', 'completed'],
    },
    amount: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    bankCode: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    accountNumber: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    cifNumber: {
      type: Sequelize.STRING,
      allowNull: true,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('transfers'),
};
