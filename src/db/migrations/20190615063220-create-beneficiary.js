module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('beneficiaries', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    cifNumber: {
      type: Sequelize.INTEGER,
      unique: true,
      allowNull: false,
    },
    cardHolderName: {
      type: Sequelize.STRING,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('beneficiaries'),
};
