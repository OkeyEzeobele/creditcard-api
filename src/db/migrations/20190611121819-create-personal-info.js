module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('personalInfos', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    middleName: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    gender: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ['MALE', 'FEMALE'],
    },
    dob: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    maritalStatus: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ['SINGLE', 'MARRIED'],
    },
    monthlyIncome: {
      type: Sequelize.BIGINT,
      allowNull: true,
    },
    bvn: {
      type: Sequelize.BIGINT,
      allowNull: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('personalInfos'),
};
