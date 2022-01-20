module.exports = (sequelize, DataTypes) => {
  const beneficiary = sequelize.define('beneficiary', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cifNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cardHolderName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    indexes: [
      {
        unique: true,
        fields: ['cifNumber'],
      },
    ],
  });
    // eslint-disable-next-line no-unused-vars
  beneficiary.associate = (models) => {
    beneficiary.belongsToMany(models.user, {
      through: 'usersBeneficiaries',
      as: 'users',
      foreignKey: 'beneficiaryId',
    });
  };
  return beneficiary;
};
