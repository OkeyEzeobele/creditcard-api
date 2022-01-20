module.exports = (sequelize, DataTypes) => {
  const usersBeneficiaries = sequelize.define('usersBeneficiaries', {
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
    beneficiaryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'beneficiaries',
        key: 'id',
      },
    },
  }, {});
  // eslint-disable-next-line no-unused-vars
  usersBeneficiaries.associate = (models) => {
    // associations can be defined here
  };
  return usersBeneficiaries;
};
