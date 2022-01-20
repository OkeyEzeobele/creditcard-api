module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nuban: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isBvnVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    spin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pushToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deviceId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    bvn: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bvnName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bvnAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bvnDob: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    indexes: [
      {
        unique: true,
        fields: ['email'],
      },
    ],
  });
  // eslint-disable-next-line no-unused-vars
  user.associate = (models) => {
    user.belongsToMany(models.beneficiary, {
      through: 'usersBeneficiaries',
      as: 'beneficiaries',
      foreignKey: 'userId',
    });

    user.belongsToMany(models.accountBeneficiary, {
      through: 'usersAccountBeneficiaries',
      as: 'accountBeneficiaries',
      foreignKey: 'userId',
    });

    user.hasMany(models.document, {
      foreignKey: 'userId',
    });

    user.hasMany(models.revision, {
      foreignKey: 'userId',
    });

    user.hasOne(models.personalInfo, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });

    user.hasOne(models.addressInfo, {
      foreignKey: 'userId',
    });

    user.hasOne(models.employerInfo, {
      foreignKey: 'userId',
    });

    user.hasOne(models.bankcard, {
      foreignKey: 'userId',
    });
  };
  return user;
};
