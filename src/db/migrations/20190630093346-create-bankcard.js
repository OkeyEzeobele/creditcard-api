module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('bankcards', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    embedToken: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    last4: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lifeTimeToken: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    shortCode: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    expiry: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    expiryMonth: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    expiryYear: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('bankcards'),
};
