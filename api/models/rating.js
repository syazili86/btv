'use strict'
export default (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    programId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        isUUID: {
          args: 4,
          msg: 'You must select correct Program'
        }
      }
    },
    user: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rate: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        len: {
          args: [3, 5],
          msg: 'Rating value must be between 1 and 5.'
        }
      }
    }
  }, {
    schema: 'public',
    paranoid: true
  })
  // Sync
  // Rating.sync({ alter: true })

  // Relation
  Rating.associate = function (models) {
    Rating.belongsTo(models.Program, {
      foreignKey: 'programId',
      onDelete: 'CASCADE'
    })
  }

  return Rating
}
