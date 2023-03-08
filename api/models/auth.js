'use strict'

export default (sequelize, DataTypes) => {
  const Auth = sequelize.define('Auth', {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    userId: DataTypes.INTEGER,
    level: {
      type: DataTypes.ENUM,
      values: ['programmer', 'admin']
    }
  }, {
    schema: 'auth',
    paranoid: true
  })
  // Relation
  Auth.associate = function (models) {}

  return Auth
}
