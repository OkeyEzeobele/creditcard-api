module.exports = (sequelize, DataTypes) => {
  const accountBeneficiary = sequelize.define('accountBeneficiary', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    accountName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bankCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accountNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    indexes: [
      {
        unique: true,
        fields: ['accountNumber'],
      },
    ],
  });
  accountBeneficiary.associate = (models) => {
    // associations can be defined here
    accountBeneficiary.belongsToMany(models.user, {
      through: 'usersAccountBeneficiaries',
      as: 'users',
      foreignKey: 'accountBeneficiaryId',
    });
  };
  return accountBeneficiary;
};
