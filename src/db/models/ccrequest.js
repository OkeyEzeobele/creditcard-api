module.exports = (sequelize, DataTypes) => {
  const ccrequest = sequelize.define('ccrequest', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
      allowNull: false,
    },
  }, {});
  // eslint-disable-next-line no-unused-vars
  ccrequest.associate = (models) => {
    // associations can be defined here
  };
  return ccrequest;
};
