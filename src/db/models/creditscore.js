module.exports = (sequelize, DataTypes) => {
  const creditscore = sequelize.define('creditscore', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    loanId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {});
  // eslint-disable-next-line no-unused-vars
  creditscore.associate = (models) => {
    // associations can be defined here
  };
  return creditscore;
};
