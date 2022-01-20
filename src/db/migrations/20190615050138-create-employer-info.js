module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('employerInfos', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    profession: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    organizationName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    yearsOnJob: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    employerAddress: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    country: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    monthlySalary: {
      type: Sequelize.BIGINT,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('employerInfos'),
};
