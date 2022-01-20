
module.exports = (sequelize, DataTypes) => {
  const transaction = sequelize.define('transaction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
    },
    fee: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    extfee: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sourceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    txref: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    response: {
      type: DataTypes.TEXT,
    },
    comment: {
      type: DataTypes.STRING,
    },
    narration: {
      type: DataTypes.STRING,
    },
  }, {});
  // eslint-disable-next-line no-unused-vars
  transaction.associate = (models) => {
    // associations can be defined here
  };
  return transaction;
};
