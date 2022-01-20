module.exports = (sequelize, DataTypes) => {
  const employerInfo = sequelize.define('employerInfo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    profession: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    organizationName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    yearsOnJob: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    employerAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    monthlySalary: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  }, {});
  // eslint-disable-next-line no-unused-vars
  employerInfo.associate = (models) => {
    employerInfo.belongsTo(models.user, {
      as: 'employeeInfo',
      foreignKey: 'userId',
    });
  };
  return employerInfo;
};
