module.exports = (sequelize, DataTypes) => {
  const addressInfo = sequelize.define('addressInfo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    homeAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    homeCity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    homeCountry: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    residencyYears: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mailingAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mailingCity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mailingCountry: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {});
  addressInfo.associate = (models) => {
    // associations can be defined here
    addressInfo.belongsTo(models.user, {
      as: 'user',
      foreignKey: 'userId',
    });
  };
  return addressInfo;
};
