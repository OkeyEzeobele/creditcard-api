module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'users',
    'dob',
    Sequelize.DATE,
  ),
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => queryInterface.removeColumn('users', 'dob'),
};
