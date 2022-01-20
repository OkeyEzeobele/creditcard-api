module.exports = (sequelize, DataTypes) => {
  const transfer = sequelize.define('transfer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['created', 'sent', 'failed', 'completed'],
    },
    amount: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bankCode: {
      type: DataTypes.STRING,
    },
    accountNumber: {
      type: DataTypes.STRING,
    },
    cifNumber: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {});
  // eslint-disable-next-line no-unused-vars
  transfer.associate = (models) => {
    // associations can be defined here
  };
  return transfer;
};
