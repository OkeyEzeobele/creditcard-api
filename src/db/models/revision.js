module.exports = (sequelize, DataTypes) => {
  const revision = sequelize.define('revision', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {});
  revision.associate = (models) => {
    // associations can be defined here
    revision.belongsTo(models.user, {
      foreignKey: 'userId',
      as: 'user',
    });
  };
  return revision;
};
