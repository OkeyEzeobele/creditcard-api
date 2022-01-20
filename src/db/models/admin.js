module.exports = (sequelize, DataTypes) => {
  const admin = sequelize.define('admin', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Email in Use',
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['admin', 'superAdmin'],
    },
  }, {
    indexes: [
      {
        unique: true,
        fields: ['email'],
      },
    ],
  });
    // eslint-disable-next-line no-unused-vars
  admin.associate = (models) => {
  };
  return admin;
};
