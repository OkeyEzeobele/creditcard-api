

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('O3cards', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    first6: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    last4: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    cardHash: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    cifNumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    appNumber: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    acctNumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    orderLabel: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    balance: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    virtual: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    type: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ['prepaid', 'credit', 'linked'],
      defaultValue: 'credit',
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('O3cards'),
};
