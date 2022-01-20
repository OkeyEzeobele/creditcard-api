module.exports = (sequelize, DataTypes) => {
  const billername = sequelize.define('billername', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {});
  // eslint-disable-next-line no-unused-vars
  billername.associate = (models) => {
    // associations can be defined here
  };
  return billername;
};
