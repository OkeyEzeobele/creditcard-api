module.exports = (sequelize, DataTypes) => {
  const personalInfo = sequelize.define('personalInfo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    middleName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['MALE', 'FEMALE'],
    },
    dob: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maritalStatus: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['SINGLE', 'MARRIED'],
    },
    monthlyIncome: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    bvn: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {});
  personalInfo.associate = (models) => {
    // associations can be defined here
    personalInfo.belongsTo(models.user, {
      foreignKey: 'userId',
      as: 'profile',
    });
  };
  return personalInfo;
};
