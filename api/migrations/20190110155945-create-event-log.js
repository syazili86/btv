'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.createSchema('log'),
      queryInterface.createTable('EventLogs', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4
        },
        eventType: {
          allowNull: false,
          type: Sequelize.ENUM,
          values: ['created', 'updated', 'deleted']
        },
        table: {
          allowNull: false,
          type: Sequelize.STRING
        },
        recordId: {
          allowNull: false,
          type: Sequelize.UUID
        },
        userId: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: true,
          type: Sequelize.DATE
        }
      }, {
        schema: 'log'
      })
    ])
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.dropSchema('log'),
      queryInterface.dropTable('EventLogs')
    ])
  }
}
