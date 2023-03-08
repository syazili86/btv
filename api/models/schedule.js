'use strict'
export default (sequelize, DataTypes) => {
  const Schedule = sequelize.define('Schedule', {
    id: {
      allowNull: false,
      autoIncrement: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    dayId: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.ENUM,
      values: [1, 2, 3, 4, 5, 6, 7]
    },
    timeStart: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.TIME
    },
    timeFinish: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.TIME
    },
    programId: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID
    },
    isActive: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    schema: 'ref',
    paranoid: true
  })
  // Relation
  Schedule.associate = function (models) {
    Schedule.belongsTo(models.Program, {
      foreignKey: 'programId',
      onDelete: 'CASCADE'
    })
  }

  return Schedule
}
