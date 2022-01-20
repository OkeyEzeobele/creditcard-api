module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn(
      'users',
      'isBvnVerified',
      Sequelize.BOOLEAN,
    ),
    queryInterface.addColumn(
      'users',
      'bvn',
      Sequelize.STRING,
    ),
    queryInterface.addColumn(
      'users',
      'bvnName',
      Sequelize.STRING,
    ),
    queryInterface.addColumn(
      'users',
      'bvnAddress',
      Sequelize.STRING,
    ),
    queryInterface.addColumn(
      'users',
      'bvnDob',
      Sequelize.STRING,
    ),
  ]),
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('users', 'isBvnVerified'),
    queryInterface.removeColumn('users', 'bvn_name'),
    queryInterface.removeColumn('users', 'bvn_address'),
    queryInterface.removeColumn('users', 'bvn_dob'),
  ]),
};
