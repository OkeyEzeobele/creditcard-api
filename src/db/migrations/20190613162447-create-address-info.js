module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('addressInfos', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    homeAddress: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    homeCity: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    homeCountry: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    residencyYears: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    mailingAddress: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    mailingCity: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    mailingCountry: {
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('addressInfos'),
};
