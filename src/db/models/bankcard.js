module.exports = (sequelize, DataTypes) => {
  const bankcard = sequelize.define('bankcard', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    embedToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last4: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lifeTimeToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shortCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiry: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiryMonth: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiryYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {});
  bankcard.associate = (models) => {
    // associations can be defined here
    bankcard.belongsTo(models.user, {
      foreignKey: 'userId',
      as: 'user',
    });
  };
  return bankcard;
};
