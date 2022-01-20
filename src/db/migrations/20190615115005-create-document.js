module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('documents', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    type: {
      type: Sequelize.ENUM,
      values: [
        'statement',
        'licence',
        'passport',
        'selfie',
        'personalIdCard',
        'jobIdCard',
      ],
    },
    data: {
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('documents'),
};
