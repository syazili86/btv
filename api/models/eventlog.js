'use strict'
export default (sequelize, DataTypes) => {
  const EventLog = sequelize.define('EventLog', {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    eventType: {
      allowNull: false,
      type: DataTypes.ENUM,
      values: ['created', 'updated', 'deleted']
    },
    table: {
      allowNull: false,
      type: DataTypes.STRING
    },
    recordId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {
    schema: 'log'
  })

  return EventLog
}
