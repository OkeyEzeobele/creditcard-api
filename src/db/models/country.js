module.exports = (sequelize, DataTypes) => {
  const country = sequelize.define('country', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isocode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {});
  // eslint-disable-next-line no-unused-vars
  country.associate = (models) => {
    // associations can be defined here
  };
  return country;
};
