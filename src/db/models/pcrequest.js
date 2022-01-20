module.exports = (sequelize, DataTypes) => {
  const pcrequest = sequelize.define('pcrequest', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
  pcrequest.associate = (models) => {
    // associations can be defined here
  };
  return pcrequest;
};
