

module.exports = (sequelize, DataTypes) => {
  const O3Card = sequelize.define('O3card', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first6: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last4: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cardHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cifNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    appNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    acctNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    orderLabel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    balance: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    virtual: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['prepaid', 'credit', 'linked'],
      defaultValue: 'credit',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {});
  O3Card.associate = (models) => {
    // associations can be defined here
    O3Card.belongsTo(models.user, {
      as: 'user',
      foreignKey: 'userId',
    });
  };
  return O3Card;
};
