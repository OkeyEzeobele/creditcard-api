module.exports = (sequelize, DataTypes) => {
  const store = sequelize.define('store', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    timestamps: true,
    // paranoid: true,
  });
    // eslint-disable-next-line no-unused-vars
    store.associate = (models) => {
  };
  return store;
};
