module.exports = (sequelize, DataTypes) => {
  const config = sequelize.define('config', {
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
    // eslint-disable-next-line no-unused-vars
  config.associate = (models) => {
  };
  return config;
};
