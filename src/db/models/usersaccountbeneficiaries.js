module.exports = (sequelize, DataTypes) => {
  const usersAccountBeneficiaries = sequelize.define('usersAccountBeneficiaries', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    accountBeneficiaryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'accountBeneficiaries',
        key: 'id',
      },
    },
  }, {});
  // eslint-disable-next-line no-unused-vars
  usersAccountBeneficiaries.associate = (models) => {
    // associations can be defined here
  };
  return usersAccountBeneficiaries;
};
