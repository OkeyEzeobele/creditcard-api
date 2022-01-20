

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('accountBeneficiaries', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    accountName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    accountNumber: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    currency: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    bankCode: {
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('accountBeneficiaries'),
};
